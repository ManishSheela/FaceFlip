import { prisma } from "../db.js";

export function createFriendPersistence(client = prisma) {
  return {
    async getFriendship(userIdA, userIdB) {
      const row = await client.friendship.findFirst({
        where: {
          status: "ACCEPTED",
          OR: [
            { requesterId: userIdA, addresseeId: userIdB },
            { requesterId: userIdB, addresseeId: userIdA },
          ],
        },
      });
      return row !== null;
    },

    async createFriendship(userIdA, userIdB) {
      const existing = await client.friendship.findFirst({
        where: {
          OR: [
            { requesterId: userIdA, addresseeId: userIdB },
            { requesterId: userIdB, addresseeId: userIdA },
          ],
        },
      });

      if (existing) {
        await client.friendship.update({
          where: { id: existing.id },
          data: { status: "ACCEPTED", respondedAt: new Date() },
        });
        return;
      }

      await client.friendship.create({
        data: {
          requesterId: userIdA,
          addresseeId: userIdB,
          status: "ACCEPTED",
          respondedAt: new Date(),
        },
      });
    },

    async removeFriendship(userIdA, userIdB) {
      await client.friendship.deleteMany({
        where: {
          OR: [
            { requesterId: userIdA, addresseeId: userIdB },
            { requesterId: userIdB, addresseeId: userIdA },
          ],
        },
      });
    },

    async getFriends(userId) {
      const rows = await client.friendship.findMany({
        where: {
          status: "ACCEPTED",
          OR: [{ requesterId: userId }, { addresseeId: userId }],
        },
        include: { requester: true, addressee: true },
      });

      return rows.map((row) => {
        const friend =
          row.requesterId === userId ? row.addressee : row.requester;
        return {
          userId: friend.id,
          name: friend.name,
          picture: friend.picture,
        };
      });
    },

    async createRequest(fromUserId, toUserId) {
      return client.friendship.create({
        data: {
          requesterId: fromUserId,
          addresseeId: toUserId,
          status: "PENDING",
        },
      });
    },

    async getRequest(fromUserId, toUserId) {
      return client.friendship.findFirst({
        where: { requesterId: fromUserId, addresseeId: toUserId },
      });
    },

    async getRequestById(requestId) {
      return client.friendship.findUnique({ where: { id: requestId } });
    },

    async getPendingRequest(fromUserId, toUserId) {
      return client.friendship.findFirst({
        where: {
          requesterId: fromUserId,
          addresseeId: toUserId,
          status: "PENDING",
        },
      });
    },

    async updateRequestStatus(requestId, status) {
      await client.friendship.update({
        where: { id: requestId },
        data: { status, respondedAt: new Date() },
      });
    },

    async getIncomingRequests(userId) {
      const rows = await client.friendship.findMany({
        where: { addresseeId: userId, status: "PENDING" },
        include: { requester: true },
      });

      return rows.map((row) => ({
        id: row.id,
        fromUserId: row.requesterId,
        name: row.requester.name,
        picture: row.requester.picture,
        createdAt: row.createdAt,
      }));
    },

    async isBlocked(userIdA, userIdB) {
      const row = await client.friendship.findFirst({
        where: {
          status: "BLOCKED",
          OR: [
            { requesterId: userIdA, addresseeId: userIdB },
            { requesterId: userIdB, addresseeId: userIdA },
          ],
        },
      });
      return row !== null;
    },

    async blockUser(blockerId, blockedId) {
      const existing = await client.friendship.findFirst({
        where: {
          OR: [
            { requesterId: blockerId, addresseeId: blockedId },
            { requesterId: blockedId, addresseeId: blockerId },
          ],
        },
      });

      if (existing) {
        await client.friendship.update({
          where: { id: existing.id },
          data: { status: "BLOCKED", respondedAt: new Date() },
        });
        return;
      }

      await client.friendship.create({
        data: {
          requesterId: blockerId,
          addresseeId: blockedId,
          status: "BLOCKED",
          respondedAt: new Date(),
        },
      });
    },
  };
}
