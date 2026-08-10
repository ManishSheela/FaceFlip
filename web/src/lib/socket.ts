import { io, type Socket } from "socket.io-client";
import { API_URL } from "@/constants";

let socket: Socket | null = null;

export function getSocket(): Socket {
	if (!socket) {
		socket = io(API_URL, {
			withCredentials: true,
			autoConnect: false,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 2000,
			timeout: 8000,
		});
	}
	return socket;
}
