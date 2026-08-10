import { EventEmitter } from "node:events";

function wants(seeker, candidate) {
  return (
    seeker.preferGender === "any" || seeker.preferGender === candidate.gender
  );
}

export class MatchmakingQueue extends EventEmitter {
  constructor() {
    super();
    this.queue = new Map();
  }

  enqueue(entry) {
    if (!entry?.socketId) return;

    this.queue.delete(entry.socketId);

    const match = this.findMatch(entry);

    if (!match) {
      this.queue.set(entry.socketId, { ...entry, joinedAt: Date.now() });
      this.emit("queued", {
        socketId: entry.socketId,
        position: this.positionOf(entry.socketId),
      });
      return;
    }

    this.queue.delete(match.socketId);
    this.emit("matched", { user1: match, user2: entry });
  }

  dequeue(socketId) {
    return this.queue.delete(socketId);
  }

  findMatch(entry) {
    let best = null;

    for (const [socketId, candidate] of this.queue) {
      if (socketId === entry.socketId) continue;
      if (!this.isCompatible(entry, candidate)) continue;
      if (best && candidate.joinedAt >= best.joinedAt) continue;
      best = candidate;
    }

    return best;
  }

  isCompatible(a, b) {
    return wants(a, b) && wants(b, a);
  }

  isWaiting(socketId) {
    return this.queue.has(socketId);
  }

  positionOf(socketId) {
    let position = 0;
    for (const id of this.queue.keys()) {
      position += 1;
      if (id === socketId) return position;
    }
    return 0;
  }

  get size() {
    return this.queue.size;
  }

  getStats() {
    const byGender = {};
    for (const entry of this.queue.values()) {
      byGender[entry.gender] = (byGender[entry.gender] ?? 0) + 1;
    }
    return { total: this.queue.size, byGender };
  }
}
