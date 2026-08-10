import { SOCKET_ERRORS } from "../constants.js";

export function registerFriendHandlers(context, on) {
  const { socket, io, roomManager, friendManager, matchQueue, pendingCalls } =
    context;

  const userId = socket.data.userId;

  function requireAccount() {
    if (userId) return true;
    socket.emit("friend:error", { reason: SOCKET_ERRORS.signInRequired });
    return false;
  }

  function notify(targetUserId, event, payload) {
    const targetSocket = friendManager.getSocketId(targetUserId);
    if (targetSocket) io.to(targetSocket).emit(event, payload);
  }

  on("friend:request", async () => {
    if (!requireAccount()) return;

    const partnerUserId = roomManager.getPartnerUserId(socket.id);
    if (!roomManager.getRoomByUser(socket.id)) {
      socket.emit("friend:error", { reason: SOCKET_ERRORS.noActivePartner });
      return;
    }
    if (!partnerUserId) {
      socket.emit("friend:error", { reason: SOCKET_ERRORS.guestPartner });
      return;
    }

    const result = await friendManager.sendRequest(userId, partnerUserId);
    socket.emit("friend:request-sent", result);

    if (result.status === "sent") {
      notify(partnerUserId, "friend:request-received", {
        requestId: result.requestId,
        fromUserId: userId,
        name: socket.data.name ?? null,
      });
    }

    if (result.status === "auto-accepted") {
      notify(partnerUserId, "friend:request-accepted", { byUserId: userId });
    }
  });

  on("friend:accept", async (payload) => {
    if (!requireAccount()) return;

    const requestId = payload?.requestId;
    if (typeof requestId !== "string") return;

    const result = await friendManager.acceptRequest(requestId, userId);
    if (result.status !== "accepted") {
      socket.emit("friend:error", { reason: SOCKET_ERRORS.noPendingCall });
      return;
    }

    socket.emit("friend:accepted", { userId: result.fromUserId });
    notify(result.fromUserId, "friend:request-accepted", { byUserId: userId });
  });

  on("friend:reject", async (payload) => {
    if (!requireAccount()) return;

    const requestId = payload?.requestId;
    if (typeof requestId !== "string") return;

    const result = await friendManager.rejectRequest(requestId, userId);
    if (result.status === "rejected") socket.emit("friend:rejected", { requestId });
  });

  on("friend:remove", async (payload) => {
    if (!requireAccount()) return;

    const friendUserId = payload?.friendUserId;
    if (typeof friendUserId !== "string") return;

    await friendManager.removeFriend(userId, friendUserId);
    socket.emit("friend:removed", { friendUserId });
    notify(friendUserId, "friend:removed", { friendUserId: userId });
  });

  on("friend:list", async () => {
    if (!userId) {
      socket.emit("friend:list-result", { friends: [] });
      return;
    }
    socket.emit("friend:list-result", {
      friends: await friendManager.getFriendsList(userId),
    });
  });

  on("friend:incoming-requests", async () => {
    if (!userId) {
      socket.emit("friend:incoming-requests-result", { requests: [] });
      return;
    }
    socket.emit("friend:incoming-requests-result", {
      requests: await friendManager.getIncomingRequests(userId),
    });
  });

  on("friend:call", async (payload) => {
    if (!requireAccount()) return;

    const friendUserId = payload?.friendUserId;
    if (typeof friendUserId !== "string") return;

    if (!(await friendManager.areFriends(userId, friendUserId))) {
      socket.emit("friend:call-error", { reason: SOCKET_ERRORS.notFriends });
      return;
    }

    const friendSocketId = friendManager.getSocketId(friendUserId);
    if (!friendSocketId) {
      socket.emit("friend:call-error", { reason: SOCKET_ERRORS.offline });
      return;
    }

    if (roomManager.isBusy(socket.id)) {
      socket.emit("friend:call-error", { reason: SOCKET_ERRORS.youAreBusy });
      return;
    }

    if (roomManager.isBusy(friendSocketId)) {
      socket.emit("friend:call-error", { reason: SOCKET_ERRORS.busy });
      return;
    }

    matchQueue.dequeue(socket.id);

    pendingCalls.set(friendSocketId, {
      callerSocketId: socket.id,
      callerUserId: userId,
    });

    io.to(friendSocketId).emit("friend:incoming-call", {
      fromUserId: userId,
      name: socket.data.name ?? null,
    });

    socket.emit("friend:call-ringing", { friendUserId });
  });

  on("friend:call-accept", () => {
    if (!requireAccount()) return;

    const invite = pendingCalls.get(socket.id);
    pendingCalls.delete(socket.id);

    if (!invite) {
      socket.emit("friend:call-error", { reason: SOCKET_ERRORS.noPendingCall });
      return;
    }

    const callerSocket = io.sockets.sockets.get(invite.callerSocketId);
    if (!callerSocket || roomManager.isBusy(invite.callerSocketId)) {
      socket.emit("friend:call-error", { reason: SOCKET_ERRORS.noPendingCall });
      return;
    }

    matchQueue.dequeue(socket.id);
    matchQueue.dequeue(invite.callerSocketId);

    const caller = {
      socketId: invite.callerSocketId,
      userId: invite.callerUserId,
      name: callerSocket.data.name ?? null,
      gender: callerSocket.data.gender ?? null,
    };
    const receiver = {
      socketId: socket.id,
      userId,
      name: socket.data.name ?? null,
      gender: socket.data.gender ?? null,
    };

    context.startRoom(caller, receiver, "friend");
  });

  on("friend:call-reject", () => {
    const invite = pendingCalls.get(socket.id);
    pendingCalls.delete(socket.id);
    if (!invite) return;

    io.to(invite.callerSocketId).emit("friend:call-rejected", {
      byUserId: userId,
    });
  });

  on("friend:call-cancel", (payload) => {
    if (!requireAccount()) return;

    const friendUserId = payload?.friendUserId;
    if (typeof friendUserId !== "string") return;

    const friendSocketId = friendManager.getSocketId(friendUserId);
    if (!friendSocketId) return;

    const invite = pendingCalls.get(friendSocketId);
    if (invite?.callerSocketId !== socket.id) return;

    pendingCalls.delete(friendSocketId);
    io.to(friendSocketId).emit("friend:call-cancelled", { byUserId: userId });
  });
}
