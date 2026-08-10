# FaceFlip — Random Video Chat (Chatrandom / Chatspin / uMingle clone)

A 1-on-1 random video chat platform. Press start → get paired with a random
stranger over video → press **Next** to flip to someone else.

---

## The key question: "which API do I consume?"

There is **no single paid API** that does this. The core technology is
**WebRTC** — a *free, built-in browser API* for real-time audio/video between
two users. Chatrandom, Chatspin, Omegle, uMingle all run on WebRTC.

What you actually need to build/run:

| Piece | What it does | This project uses |
|-------|--------------|-------------------|
| **WebRTC** (browser API) | Sends video/audio peer-to-peer, browser ↔ browser | Native, free |
| **Signaling server** | A middleman so two browsers can *find each other* and swap connection info (SDP + ICE). Does **not** touch video. | Node.js + Socket.IO (this repo) |
| **STUN server** | Tells a browser its public IP so peers can connect directly | Google's free STUN |
| **TURN server** | Relays video when a direct connection is blocked by NAT/firewall (~10–20% of users). **Required in production.** | Bring your own (see below) |
| **Matchmaking** | Pairs waiting users randomly | Built into the signaling server |

> You only pay for **TURN bandwidth** and **hosting**. Everything else is free.

### TURN options (pick one for production)
- **[Metered OpenRelay](https://www.metered.ca/tools/openrelay/)** — free tier, fastest to start.
- **Self-hosted [coturn](https://github.com/coturn/coturn)** — cheapest at scale, a bit of DevOps.
- **Twilio Network Traversal Service** — pay-as-you-go, very reliable.

Set `TURN_URL` / `TURN_USERNAME` / `TURN_CREDENTIAL` in `server/.env`.

---

## Architecture

```
┌──────────────┐         WebSocket (signaling only)        ┌──────────────┐
│   Browser A  │◄──────────────┐             ┌────────────►│   Browser B  │
│  (Next.js)   │               │             │             │  (Next.js)   │
└──────┬───────┘        ┌──────▼─────────────▼──────┐      └──────┬───────┘
       │                │   Signaling Server         │             │
       │                │   Node.js + Socket.IO      │             │
       │                │   • matchmaking queue      │             │
       │                │   • relays SDP offer/answer│             │
       │                │   • relays ICE candidates  │             │
       │                │   • relays text chat       │             │
       │                └────────────────────────────┘             │
       │                                                            │
       │        Video + audio go P2P, DIRECTLY (WebRTC)             │
       └────────────────────────────────────────────────────────────┘
                    (relayed via TURN only if P2P fails)
```

**Why the server never sees the video:** with P2P WebRTC, media flows straight
between the two browsers. The server only helps them shake hands. This is why
it's cheap — your server bandwidth stays tiny no matter how many calls happen.

### Frontend architecture (`web/`)
```
web/
├── app/
│   ├── layout.tsx          Root layout + global styles
│   ├── page.tsx            Landing page (marketing)
│   └── chat/page.tsx       The video chat UI (client component)
├── lib/
│   └── useVideoChat.ts     ★ All WebRTC + socket logic (custom React hook)
└── tailwind.config.ts
```
The UI is deliberately "dumb" — every hard part (getUserMedia, RTCPeerConnection,
offer/answer negotiation, ICE, socket events) is isolated in the
`useVideoChat` hook. Swap the UI freely without touching connection logic.

### Backend architecture (`server/`)
```
server/
└── src/
    ├── index.js        Express + Socket.IO wiring, signaling relay, /ice endpoint
    └── matchmaker.js   FIFO queue that pairs strangers + tracks active pairs
```

---

## Tech stack

**Frontend:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · socket.io-client
**Backend:** Node.js · Express · Socket.IO
**Realtime media:** WebRTC (native) · STUN/TURN
**Recommended hosting:** Frontend → Vercel · Server → Render / Railway / Fly.io · TURN → Metered or coturn on a VPS

---

## Running locally

Open **two terminals**.

**1. Signaling server**
```bash
cd server
cp .env.example .env
npm install
npm run dev
# → http://localhost:4000
```

**2. Web app**
```bash
cd web
cp .env.local.example .env.local
npm install
npm run dev
# → http://localhost:5174
```

**Test the pairing:** open `http://localhost:5174/chat` in **two different
browser windows** (or one normal + one incognito), press **Start** in both.
They'll match and connect. Press **Next** to re-pair.

> Camera/mic require `https://` or `localhost`. Localhost is exempt, so local
> dev works. In production you **must** serve over HTTPS.

---

## Roadmap / what a real product adds next

These are the things that turn this scaffold into a Chatrandom competitor.
Ranked by priority:

1. **Moderation** — the #1 real-world problem. Add an AI nudity/abuse filter on
   a periodic snapshot of each stream (e.g. AWS Rekognition, Hive, Sightengine),
   a Report button, and auto-ban logic. *Do this before any public launch.*
2. **Age gate + Terms consent** on entry.
3. **TURN server** wired up (see above) — connections will fail without it.
4. **Filters** — gender, country, interests. Extend `matchmaker.js` to match on
   tags instead of pure FIFO.
5. **Scaling** — move the matchmaking queue to **Redis** so you can run multiple
   server instances behind a load balancer (Socket.IO has a Redis adapter).
6. **Text-only fallback**, screenshot/recording protection, rate limiting.
7. **Accounts, premium tier, coins** — the monetization layer these sites use.

---

## How the connection actually happens (for reference)

1. Browser A and B both connect to the signaling server and emit `find`.
2. Server pairs them, tells A `initiator: true`, B `initiator: false`.
3. A creates an **SDP offer**, sends it via the server to B.
4. B sets it, creates an **SDP answer**, sends it back to A.
5. Both trade **ICE candidates** (possible network paths) until one works.
6. Media flows P2P. Server's job is done until someone presses **Next**.
