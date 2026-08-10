import { MEDIA_KINDS } from "../constants.js";

export function registerSignalingHandlers(socket, io, roomManager, on) {
  function relay(event, payload) {
    const partner = roomManager.getPartner(socket.id);
    if (!partner) return;
    io.to(partner).emit(event, { ...payload, from: socket.id });
  }

  on("rtc:offer", (payload) => {
    if (!payload?.sdp) return;
    relay("rtc:offer", { sdp: payload.sdp });
  });

  on("rtc:answer", (payload) => {
    if (!payload?.sdp) return;
    relay("rtc:answer", { sdp: payload.sdp });
  });

  on("rtc:ice-candidate", (payload) => {
    if (!payload?.candidate) return;
    relay("rtc:ice-candidate", { candidate: payload.candidate });
  });

  on("rtc:media-toggle", (payload) => {
    if (!MEDIA_KINDS.includes(payload?.kind)) return;
    relay("rtc:media-toggle", {
      kind: payload.kind,
      enabled: payload.enabled === true,
    });
  });
}
