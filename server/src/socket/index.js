import { Server } from "socket.io";
import { prisma } from "../db.js";
import { getSessionUserIdFromCookieHeader } from "../auth.js";
import { MatchmakingQueue } from "../matching/matchmaking-queue.js";
import { RoomManager } from "../matching/room-manager.js";
import { FriendManager } from "../social/friend-manager.js";
import { createFriendPersistence } from "../social/friend-persistence.js";
import { iceServers } from "../config/ice.js";
import { registerSignalingHandlers } from "./signaling-handler.js";
import { registerChatHandlers } from "./chat-handler.js";
import { registerFriendHandlers } from "./friend-handler.js";
import { registerModerationHandlers } from "./moderation-handler.js";
import {
  CLIENT_ORIGIN,
  DEFAULT_GENDER,
  DEFAULT_GENDER_PREFERENCE,
  GENDERS,
  GENDER_PREFERENCES,
  MATCH_END_REASONS,
  STATS_INTERVAL_MS,
} from "../constants.js";

function normalize(list, value, fallback) {
  return list.includes(value) ? value : fallback;
}

function genderFromDb(value) {
  const gender = value?.toLowerCase() ?? null;
  return gender === "male" || gender === "female" ? gender : null;
}

export function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: CLIENT_ORIGIN, credentials: true },
    pingTimeout: 30000,
    pingInterval: 10000,
  });

  const matchQueue = new MatchmakingQueue();
  const roomManager = new RoomManager();
  const friendManager = new FriendManager(createFriendPersistence());
  const pendingCalls = new Map();

  function emitMatch(room, source) {
    const [aSocket, bSocket] = room.users;

    io.to(aSocket).emit("match:found", {
      roomId: room.roomId,
      role: "initiator",
      partnerId: bSocket,
      partner: room.profiles[1],
      source,
      iceServers: iceServers(),
    });

    io.to(bSocket).emit("match:found", {
      roomId: room.roomId,
      role: "responder",
      partnerId: aSocket,
      partner: room.profiles[0],
      source,
      iceServers: iceServers(),
    });

    console.log(`[MATCH:${source}] ${aSocket} <-> ${bSocket}`);
  }

  function startRoom(user1, user2, source) {
    const room = roomManager.createRoom(user1, user2, source);
    emitMatch(room, source);
    return room;
  }

  matchQueue.on("matched", ({ user1, user2 }) => {
    startRoom(user1, user2, "random");
  });

  function leaveRoom(socketId, reason) {
    const result = roomManager.destroyRoom(socketId);
    if (result?.partner) io.to(result.partner).emit("match:ended", { reason });
    return result;
  }

  function clearPendingCallsFor(socketId) {
    const invite = pendingCalls.get(socketId);
    if (invite) {
      pendingCalls.delete(socketId);
      io.to(invite.callerSocketId).emit("friend:call-cancelled", {
        byUserId: null,
      });
    }

    for (const [receiverSocketId, entry] of pendingCalls) {
      if (entry.callerSocketId !== socketId) continue;
      pendingCalls.delete(receiverSocketId);
      io.to(receiverSocketId).emit("friend:call-cancelled", {
        byUserId: entry.callerUserId,
      });
    }
  }

  io.use(async (socket, next) => {
    const userId = getSessionUserIdFromCookieHeader(
      socket.handshake.headers.cookie,
    );

    socket.data.userId = null;
    socket.data.name = null;
    socket.data.gender = null;
    socket.data.genderPref = null;

    if (!userId) return next();

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        socket.data.userId = user.id;
        socket.data.name = user.name;
        socket.data.gender = genderFromDb(user.gender);
        socket.data.genderPref = user.genderPref?.toLowerCase() ?? null;
      }
    } catch (err) {
      console.error("socket identity lookup failed", err);
    }

    next();
  });

  io.on("connection", (socket) => {
    console.log(
      `[CONNECT] ${socket.id} (${socket.data.userId ? `user ${socket.data.userId}` : "guest"})`,
    );

    friendManager.setOnline(socket.data.userId, socket.id);

    const on = (event, handler) => {
      socket.on(event, (payload) => {
        try {
          const result = handler(payload);
          if (result instanceof Promise) {
            result.catch((err) => console.error(`[${event}] failed`, err));
          }
        } catch (err) {
          console.error(`[${event}] failed`, err);
        }
      });
    };

    const context = {
      socket,
      io,
      roomManager,
      friendManager,
      matchQueue,
      pendingCalls,
      startRoom,
    };

    registerSignalingHandlers(socket, io, roomManager, on);
    registerChatHandlers(socket, io, roomManager, on);
    registerFriendHandlers(context, on);
    registerModerationHandlers(context, on);

    function queueEntry(payload) {
      const account = socket.data;
      return {
        socketId: socket.id,
        userId: account.userId,
        name: account.name,
        gender: account.userId
          ? (account.gender ?? DEFAULT_GENDER)
          : normalize(GENDERS, payload?.gender, DEFAULT_GENDER),
        preferGender: account.userId
          ? preferenceFromAccount(account, payload)
          : normalize(
              GENDER_PREFERENCES,
              payload?.preferGender,
              DEFAULT_GENDER_PREFERENCE,
            ),
      };
    }

    function preferenceFromAccount(account, payload) {
      const stored = account.genderPref;
      if (stored === "male" || stored === "female") return stored;
      if (stored === "random") return "any";
      return normalize(
        GENDER_PREFERENCES,
        payload?.preferGender,
        DEFAULT_GENDER_PREFERENCE,
      );
    }

    function emitSearching() {
      if (!matchQueue.isWaiting(socket.id)) return;
      socket.emit("match:searching", {
        position: matchQueue.positionOf(socket.id),
        waiting: matchQueue.size,
        online: io.engine.clientsCount,
      });
    }

    on("match:find", (payload) => {
      if (roomManager.isBusy(socket.id)) return;

      clearPendingCallsFor(socket.id);

      if (matchQueue.isWaiting(socket.id)) {
        emitSearching();
        return;
      }

      matchQueue.enqueue(queueEntry(payload));
      emitSearching();
    });

    on("match:skip", (payload) => {
      const left = leaveRoom(socket.id, MATCH_END_REASONS.partnerSkipped);

      if (!left && matchQueue.isWaiting(socket.id)) {
        emitSearching();
        return;
      }

      matchQueue.enqueue(queueEntry(payload));
      emitSearching();
    });

    on("match:cancel", () => {
      matchQueue.dequeue(socket.id);
      leaveRoom(socket.id, MATCH_END_REASONS.partnerLeft);
      clearPendingCallsFor(socket.id);
      socket.emit("match:cancelled");
    });

    socket.on("disconnect", (reason) => {
      console.log(`[DISCONNECT] ${socket.id} — ${reason}`);

      matchQueue.dequeue(socket.id);
      clearPendingCallsFor(socket.id);
      leaveRoom(socket.id, MATCH_END_REASONS.partnerDisconnected);
      friendManager.setOffline(socket.data.userId, socket.id);
    });
  });

  const stats = setInterval(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[STATS]",
        JSON.stringify({
          queue: matchQueue.getStats(),
          activeRooms: roomManager.activeRoomCount,
          connections: io.engine.clientsCount,
        }),
      );
    }
  }, STATS_INTERVAL_MS);
  stats.unref();

  return { io, matchQueue, roomManager, friendManager };
}
