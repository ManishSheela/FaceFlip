import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { authRouter } from "./auth-service.js";
import { initSocketServer } from "./socket/index.js";
import { iceServers } from "./config/ice.js";
import { CLIENT_ORIGIN, PORT, SERVER_ERROR } from "./constants.js";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const httpServer = createServer(app);
const { matchQueue, roomManager } = initSocketServer(httpServer);

app.get("/ice", (_req, res) => res.json({ iceServers: iceServers() }));

app.get("/health", (_req, res) =>
  res.json({
    ok: true,
    waiting: matchQueue.size,
    activeRooms: roomManager.activeRoomCount,
  }),
);

app.use("/auth", authRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.expose ? err.message : SERVER_ERROR });
});

httpServer.listen(PORT, () => {
  console.log(`FaceFlip signaling server on http://localhost:${PORT}`);
  console.log(`Allowing client origin: ${CLIENT_ORIGIN}`);
});
