import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { Matchmaker } from "./matchmaker.js";
import { authRouter } from "./auth-routes.js";
import { registerSocketHandlers } from "./socket-handlers.js";
import { CLIENT_ORIGIN, PORT, STUN_SERVER_URL } from "./constants.js";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CLIENT_ORIGIN, methods: ["GET", "POST"] },
});

const matchmaker = new Matchmaker();

function iceServers() {
  const servers = [{ urls: STUN_SERVER_URL }];

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
app.use("/auth", authRouter);

registerSocketHandlers(io, matchmaker);

httpServer.listen(PORT, () => {
  console.log(`FaceFlip signaling server on http://localhost:${PORT}`);
  console.log(`Allowing client origin: ${CLIENT_ORIGIN}`);
});
