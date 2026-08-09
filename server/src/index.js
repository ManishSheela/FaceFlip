import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { CLIENT_ORIGIN, PORT, STUN_SERVER_URL } from "./constants.js";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

const httpServer = createServer(app);

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
app.get("/health", (_req, res) => res.json({ ok: true }));

httpServer.listen(PORT, () => {
  console.log(`FaceFlip server on http://localhost:${PORT}`);
  console.log(`Allowing client origin: ${CLIENT_ORIGIN}`);
});
