import { randomUUID } from "node:crypto";
import { MAX_CHAT_LENGTH, MAX_ROOM_MESSAGES } from "../constants.js";

export class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.userToRoom = new Map();
  }

  createRoom(user1, user2, source = "random") {
    const roomId = `room_${randomUUID().slice(0, 8)}`;

    const room = {
      roomId,
      users: [user1.socketId, user2.socketId],
      userIds: [user1.userId ?? null, user2.userId ?? null],
      profiles: [profileOf(user1), profileOf(user2)],
      source,
      createdAt: Date.now(),
      initiator: user1.socketId,
      responder: user2.socketId,
      messages: [],
    };

    this.rooms.set(roomId, room);
    this.userToRoom.set(user1.socketId, roomId);
    this.userToRoom.set(user2.socketId, roomId);

    return room;
  }

  getRoomByUser(socketId) {
    const roomId = this.userToRoom.get(socketId);
    return roomId ? (this.rooms.get(roomId) ?? null) : null;
  }

  getPartner(socketId) {
    const room = this.getRoomByUser(socketId);
    if (!room) return null;
    return room.users.find((id) => id !== socketId) ?? null;
  }

  indexOf(room, socketId) {
    return room.users[0] === socketId ? 0 : 1;
  }

  getPartnerUserId(socketId) {
    const room = this.getRoomByUser(socketId);
    if (!room) return null;
    return room.userIds[this.indexOf(room, socketId) === 0 ? 1 : 0];
  }

  getPartnerProfile(socketId) {
    const room = this.getRoomByUser(socketId);
    if (!room) return null;
    return room.profiles[this.indexOf(room, socketId) === 0 ? 1 : 0];
  }

  isBusy(socketId) {
    return this.userToRoom.has(socketId);
  }

  destroyRoom(socketId) {
    const roomId = this.userToRoom.get(socketId);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) {
      this.userToRoom.delete(socketId);
      return null;
    }

    const partner = room.users.find((id) => id !== socketId) ?? null;

    for (const id of room.users) this.userToRoom.delete(id);
    this.rooms.delete(roomId);

    return {
      roomId,
      partner,
      source: room.source,
      duration: Date.now() - room.createdAt,
    };
  }

  addMessage(socketId, text) {
    const room = this.getRoomByUser(socketId);
    if (!room) return null;

    const message = {
      id: randomUUID().slice(0, 8),
      from: socketId,
      text: text.slice(0, MAX_CHAT_LENGTH),
      timestamp: Date.now(),
    };

    room.messages.push(message);
    if (room.messages.length > MAX_ROOM_MESSAGES) room.messages.shift();

    return message;
  }

  get activeRoomCount() {
    return this.rooms.size;
  }
}

function profileOf(user) {
  return {
    name: user.name ?? null,
    gender: user.gender ?? null,
    isGuest: !user.userId,
  };
}
