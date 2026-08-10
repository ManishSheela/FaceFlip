import { MAX_CHAT_LENGTH } from "../constants.js";

export function registerChatHandlers(socket, io, roomManager, on) {
  on("chat:message", (payload) => {
    const text = payload?.text;
    if (typeof text !== "string") return;

    const sanitized = text.trim().slice(0, MAX_CHAT_LENGTH);
    if (!sanitized) return;

    const partner = roomManager.getPartner(socket.id);
    if (!partner) return;

    const message = roomManager.addMessage(socket.id, sanitized);
    if (!message) return;

    io.to(partner).emit("chat:message", {
      id: message.id,
      text: message.text,
      timestamp: message.timestamp,
      fromSelf: false,
    });

    socket.emit("chat:message-ack", {
      id: message.id,
      timestamp: message.timestamp,
    });
  });

  on("chat:typing", (payload) => {
    const partner = roomManager.getPartner(socket.id);
    if (!partner) return;

    io.to(partner).emit("chat:typing", { isTyping: payload?.isTyping === true });
  });
}
