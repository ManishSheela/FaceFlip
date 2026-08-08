export function registerSocketHandlers(io, matchmaker) {
  io.on("connection", (socket) => {
    console.log(`+ connect ${socket.id} (online: ${io.engine.clientsCount})`);

    function emitMatch({ roomId, a, b }) {
      io.to(a).emit("matched", { roomId, partnerId: b, initiator: true });
      io.to(b).emit("matched", { roomId, partnerId: a, initiator: false });
    }

    function findPartner() {
      const match = matchmaker.enqueue(socket.id);
      if (!match) {
        socket.emit("waiting");
        return;
      }
      emitMatch(match);
      console.log(`= matched ${match.a} <-> ${match.b}`);
    }

    function requeuePartner(orphanId) {
      io.to(orphanId).emit("partner-left");
      const match = matchmaker.enqueue(orphanId);
      if (match) emitMatch(match);
      else io.to(orphanId).emit("waiting");
    }

    socket.on("find", findPartner);

    socket.on("signal", ({ to, data }) => {
      if (matchmaker.partnerOf(socket.id) === to) {
        io.to(to).emit("signal", { from: socket.id, data });
      }
    });

    socket.on("chat", ({ text }) => {
      const partnerId = matchmaker.partnerOf(socket.id);
      if (partnerId) io.to(partnerId).emit("chat", { text });
    });

    socket.on("typing", () => {
      const partnerId = matchmaker.partnerOf(socket.id);
      if (partnerId) io.to(partnerId).emit("typing");
    });

    socket.on("next", () => {
      const orphanId = matchmaker.unpair(socket.id);
      if (orphanId) requeuePartner(orphanId);
      findPartner();
    });

    socket.on("stop", () => {
      matchmaker.dequeue(socket.id);
      const orphanId = matchmaker.unpair(socket.id);
      if (orphanId) requeuePartner(orphanId);
    });

    socket.on("disconnect", () => {
      console.log(`- disconnect ${socket.id}`);
      const orphanId = matchmaker.remove(socket.id);
      if (orphanId) requeuePartner(orphanId);
    });
  });
}
