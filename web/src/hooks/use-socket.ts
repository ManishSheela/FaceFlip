"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";

type Listener = (...args: unknown[]) => void;

export interface SocketApi {
	socket: React.RefObject<Socket | null>;
	isConnected: boolean;
	connectionFailed: boolean;
	emit: (event: string, data?: unknown) => void;
	on: <T>(event: string, handler: (payload: T) => void) => () => void;
}

export function useSocket(): SocketApi {
	const socketRef = useRef<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [connectionFailed, setConnectionFailed] = useState(false);

	if (socketRef.current === null) socketRef.current = getSocket();

	useEffect(() => {
		const socket = getSocket();
		socketRef.current = socket;

		const onConnect = () => {
			setIsConnected(true);
			setConnectionFailed(false);
		};
		const onDisconnect = () => setIsConnected(false);
		const onConnectError = () => setConnectionFailed(true);

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("connect_error", onConnectError);

		if (!socket.connected) socket.connect();
		else setIsConnected(true);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("connect_error", onConnectError);
		};
	}, []);

	const emit = useCallback((event: string, data?: unknown) => {
		socketRef.current?.emit(event, data);
	}, []);

	const on = useCallback(<T,>(event: string, handler: (payload: T) => void) => {
		const socket = socketRef.current;
		const listener = handler as Listener;

		socket?.on(event, listener);
		return () => {
			socket?.off(event, listener);
		};
	}, []);

	return { socket: socketRef, isConnected, connectionFailed, emit, on };
}
