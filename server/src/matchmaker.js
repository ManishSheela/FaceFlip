
export class Matchmaker {
  constructor() {
    /** @type {string[]} socket ids waiting for a partner */
    this.queue = [];
    /** @type {Map<string, { partnerId: string, roomId: string }>} */
    this.pairs = new Map();
  }

  enqueue(socketId) {
  
    if (this.pairs.has(socketId) || this.queue.includes(socketId)) return null;

    const partnerId = this.queue.shift();

    if (!partnerId) {
      this.queue.push(socketId);
      return null;
    }

    const roomId = `${partnerId}#${socketId}`;
    this.pairs.set(socketId, { partnerId, roomId });
    this.pairs.set(partnerId, { partnerId: socketId, roomId });

    return { roomId, a: partnerId, b: socketId };
  }

  dequeue(socketId) {
    this.queue = this.queue.filter((id) => id !== socketId);
  }

  partnerOf(socketId) {
    return this.pairs.get(socketId)?.partnerId ?? null;
  }


  unpair(socketId) {
    const entry = this.pairs.get(socketId);
    if (!entry) return null;

    const { partnerId } = entry;
    this.pairs.delete(socketId);
    this.pairs.delete(partnerId);
    return partnerId;
  }

  remove(socketId) {
    this.dequeue(socketId);
    return this.unpair(socketId);
  }

  stats() {
    return { waiting: this.queue.length, active: this.pairs.size / 2 };
  }
}
