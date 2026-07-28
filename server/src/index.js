import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { Matchmaker } from "./matchmaker.js";

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CLIENT_ORIGIN, methods: ["GET", "POST"] },
});

const matchmaker = new Matchmaker();

function iceServers() {
  const servers = [{ urls: "stun:stun.l.google.com:19302" }];

  if (process.env.TURN_URL) {
    servers.push({
      urls: process.env.TURN_URL,
      username: process.env.TURN_USERNAME,
      credential: process.env.TURN_CREDENTIAL,
    });
  }
  return servers;
}

app.get("/ice", (_req, res) => res.json({ iceServers: iceServers() }));
app.get("/health", (_req, res) => res.json({ ok: true, ...matchmaker.stats() }));

io.on("connection", (socket) => {
  console.log(`+ connect ${socket.id} (online: ${io.engine.clientsCount})`);

  function findPartner() {
    const match = matchmaker.enqueue(socket.id);
    if (!match) {
      socket.emit("waiting");
      return;
    }
    const { roomId, a, b } = match;

    io.to(a).emit("matched", { roomId, partnerId: b, initiator: true });
    io.to(b).emit("matched", { roomId, partnerId: a, initiator: false });
    console.log(`= matched ${a} <-> ${b}`);
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
    if (orphanId) {
      io.to(orphanId).emit("partner-left");
      // Re-queue the partner so they get someone new automatically.
      const m = matchmaker.enqueue(orphanId);
      if (!m) io.to(orphanId).emit("waiting");
      else emitMatch(m);
    }
    findPartner();
  });

  socket.on("stop", () => {
    matchmaker.dequeue(socket.id);
    const orphanId = matchmaker.unpair(socket.id);
    if (orphanId) {
      io.to(orphanId).emit("partner-left");
      const m = matchmaker.enqueue(orphanId);
      if (m) emitMatch(m);
      else io.to(orphanId).emit("waiting");
    }
  });

  socket.on("disconnect", () => {
    console.log(`- disconnect ${socket.id}`);
    const orphanId = matchmaker.remove(socket.id);
    if (orphanId) {
      io.to(orphanId).emit("partner-left");
      const m = matchmaker.enqueue(orphanId);
      if (m) emitMatch(m);
      else io.to(orphanId).emit("waiting");
    }
  });

  function emitMatch({ roomId, a, b }) {
    io.to(a).emit("matched", { roomId, partnerId: b, initiator: true });
    io.to(b).emit("matched", { roomId, partnerId: a, initiator: false });
  }
});

httpServer.listen(PORT, () => {
  console.log(`FaceFlip signaling server on http://localhost:${PORT}`);
  console.log(`Allowing client origin: ${CLIENT_ORIGIN}`);
});
