export class FriendManager {
  constructor(persistence) {
    this.db = persistence;
    this.onlineUsers = new Map();
  }

  setOnline(userId, socketId) {
    if (!userId) return;
    this.onlineUsers.set(userId, socketId);
  }

  setOffline(userId, socketId) {
    if (!userId) return;
    if (this.onlineUsers.get(userId) === socketId) {
      this.onlineUsers.delete(userId);
    }
  }

  isOnline(userId) {
    return this.onlineUsers.has(userId);
  }

  getSocketId(userId) {
    return this.onlineUsers.get(userId) ?? null;
  }

  async sendRequest(fromUserId, toUserId) {
    if (!fromUserId || !toUserId) return { status: "error", reason: "guest" };
    if (fromUserId === toUserId) return { status: "error", reason: "self" };

    if (await this.db.isBlocked(fromUserId, toUserId)) {
      return { status: "error", reason: "blocked" };
    }

    if (await this.db.getFriendship(fromUserId, toUserId)) {
      return { status: "already-friends" };
    }

    const reverse = await this.db.getPendingRequest(toUserId, fromUserId);
    if (reverse) {
      await this.db.updateRequestStatus(reverse.id, "ACCEPTED");
      return { status: "auto-accepted" };
    }

    const existing = await this.db.getRequest(fromUserId, toUserId);
    if (existing?.status === "PENDING") return { status: "already-pending" };

    if (existing) {
      await this.db.updateRequestStatus(existing.id, "PENDING");
      return { status: "sent", requestId: existing.id };
    }

    const request = await this.db.createRequest(fromUserId, toUserId);
    return { status: "sent", requestId: request.id };
  }

  async acceptRequest(requestId, toUserId) {
    const request = await this.db.getRequestById(requestId);
    if (!request || request.addresseeId !== toUserId) {
      return { status: "error", reason: "not-found" };
    }
    if (request.status !== "PENDING") {
      return { status: "error", reason: "not-pending" };
    }

    await this.db.updateRequestStatus(requestId, "ACCEPTED");
    return { status: "accepted", fromUserId: request.requesterId };
  }

  async rejectRequest(requestId, toUserId) {
    const request = await this.db.getRequestById(requestId);
    if (!request || request.addresseeId !== toUserId) {
      return { status: "error", reason: "not-found" };
    }

    await this.db.updateRequestStatus(requestId, "DECLINED");
    return { status: "rejected", fromUserId: request.requesterId };
  }

  async removeFriend(userIdA, userIdB) {
    await this.db.removeFriendship(userIdA, userIdB);
    return { status: "removed" };
  }

  async areFriends(userIdA, userIdB) {
    if (!userIdA || !userIdB) return false;
    return this.db.getFriendship(userIdA, userIdB);
  }

  async block(blockerId, blockedId) {
    if (!blockerId || !blockedId) return { status: "error", reason: "guest" };
    await this.db.blockUser(blockerId, blockedId);
    return { status: "blocked" };
  }

  async getFriendsList(userId) {
    const friends = await this.db.getFriends(userId);
    return friends.map((friend) => ({
      ...friend,
      online: this.isOnline(friend.userId),
    }));
  }

  async getIncomingRequests(userId) {
    return this.db.getIncomingRequests(userId);
  }
}
