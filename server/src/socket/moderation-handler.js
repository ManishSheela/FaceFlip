import {
  MATCH_END_REASONS,
  MAX_REPORT_DETAILS_LENGTH,
  REPORT_REASONS,
} from "../constants.js";

export function registerModerationHandlers(context, on) {
  const { socket, io, roomManager, friendManager } = context;

  on("user:report", (payload) => {
    const room = roomManager.getRoomByUser(socket.id);
    if (!room) return;

    const reason = REPORT_REASONS.includes(payload?.reason)
      ? payload.reason
      : "other";

    const report = {
      reporterUserId: socket.data.userId ?? null,
      reporterSocketId: socket.id,
      reportedUserId: roomManager.getPartnerUserId(socket.id),
      reportedSocketId: roomManager.getPartner(socket.id),
      roomId: room.roomId,
      reason,
      details:
        typeof payload?.details === "string"
          ? payload.details.slice(0, MAX_REPORT_DETAILS_LENGTH)
          : null,
      timestamp: Date.now(),
    };

    console.log("[REPORT]", JSON.stringify(report));
    socket.emit("user:report-ack", { success: true });
  });

  on("user:block-and-skip", async () => {
    const partner = roomManager.getPartner(socket.id);
    const partnerUserId = roomManager.getPartnerUserId(socket.id);
    if (!partner) return;

    if (socket.data.userId && partnerUserId) {
      await friendManager.block(socket.data.userId, partnerUserId);
    }

    roomManager.destroyRoom(socket.id);

    socket.emit("match:ended", { reason: MATCH_END_REASONS.blocked });
    io.to(partner).emit("match:ended", {
      reason: MATCH_END_REASONS.partnerLeft,
    });
  });
}
