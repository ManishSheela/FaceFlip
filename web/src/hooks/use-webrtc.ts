"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { MEDIA_CONSTRAINTS } from "@/constants";
import type { MatchErrorCode } from "@/types";

interface UseWebRtcOptions {
	socket: React.RefObject<Socket | null>;
	onRemoteStream: (stream: MediaStream) => void;
	onFailed: () => void;
}

export function mediaErrorCode(err: unknown): MatchErrorCode {
	const name = err instanceof DOMException ? err.name : "";
	return name === "NotAllowedError" || name === "SecurityError"
		? "media-denied"
		: "media-unavailable";
}

export function useWebRtc({
	socket,
	onRemoteStream,
	onFailed,
}: UseWebRtcOptions) {
	const peerRef = useRef<RTCPeerConnection | null>(null);
	const localStreamRef = useRef<MediaStream | null>(null);
	const streamRequestRef = useRef<Promise<MediaStream> | null>(null);
	const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
	const restartedRef = useRef(false);

	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [audioEnabled, setAudioEnabled] = useState(true);
	const [videoEnabled, setVideoEnabled] = useState(true);

	const startLocalStream = useCallback(async () => {
		if (localStreamRef.current) return localStreamRef.current;
		if (streamRequestRef.current) return streamRequestRef.current;

		const request = (async () => {
			const stream = await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS);
			localStreamRef.current = stream;
			setLocalStream(stream);
			setAudioEnabled(stream.getAudioTracks().some((t) => t.enabled));
			setVideoEnabled(stream.getVideoTracks().some((t) => t.enabled));
			return stream;
		})();

		streamRequestRef.current = request;
		try {
			return await request;
		} finally {
			streamRequestRef.current = null;
		}
	}, []);

	const closePeer = useCallback(() => {
		peerRef.current?.close();
		peerRef.current = null;
		pendingCandidatesRef.current = [];
		restartedRef.current = false;
	}, []);

	const stopLocalStream = useCallback(() => {
		localStreamRef.current?.getTracks().forEach((track) => track.stop());
		localStreamRef.current = null;
		setLocalStream(null);
	}, []);

	const sendOffer = useCallback(
		async (peer: RTCPeerConnection, iceRestart: boolean) => {
			const offer = await peer.createOffer(iceRestart ? { iceRestart } : undefined);
			if (peer !== peerRef.current) return;

			await peer.setLocalDescription(offer);
			socket.current?.emit("rtc:offer", { sdp: peer.localDescription });
		},
		[socket],
	);

	const hasLocalStream = useCallback(() => localStreamRef.current !== null, []);

	const createPeer = useCallback(
		(iceServers: RTCIceServer[]) => {
			peerRef.current?.close();
			restartedRef.current = false;

			const peer = new RTCPeerConnection({ iceServers });
			peerRef.current = peer;

			peer.onicecandidate = (event) => {
				if (event.candidate) {
					socket.current?.emit("rtc:ice-candidate", {
						candidate: event.candidate.toJSON(),
					});
				}
			};

			peer.ontrack = (event) => {
				const [stream] = event.streams;
				if (stream) onRemoteStream(stream);
			};

			peer.onconnectionstatechange = () => {
				if (peer !== peerRef.current) return;

				if (peer.connectionState !== "failed") return;

				if (!restartedRef.current && peer.localDescription?.type === "offer") {
					restartedRef.current = true;
					void sendOffer(peer, true).catch(onFailed);
					return;
				}
				onFailed();
			};

			const stream = localStreamRef.current;
			if (stream) {
				for (const track of stream.getTracks()) peer.addTrack(track, stream);
			}

			return peer;
		},
		[socket, onRemoteStream, onFailed, sendOffer],
	);

	const flushCandidates = useCallback(async (peer: RTCPeerConnection) => {
		const queued = pendingCandidatesRef.current;
		pendingCandidatesRef.current = [];
		for (const candidate of queued) {
			await peer.addIceCandidate(new RTCIceCandidate(candidate));
		}
	}, []);

	const createOffer = useCallback(
		async (iceServers: RTCIceServer[]) => {
			const peer = createPeer(iceServers);
			await sendOffer(peer, false);
		},
		[createPeer, sendOffer],
	);

	const handleOffer = useCallback(
		async (sdp: RTCSessionDescriptionInit, iceServers: RTCIceServer[]) => {
			const existing = peerRef.current;
			const peer =
				existing && existing.connectionState !== "closed"
					? existing
					: createPeer(iceServers);

			await peer.setRemoteDescription(new RTCSessionDescription(sdp));
			const answer = await peer.createAnswer();
			await peer.setLocalDescription(answer);
			socket.current?.emit("rtc:answer", { sdp: peer.localDescription });
			await flushCandidates(peer);
		},
		[createPeer, flushCandidates, socket],
	);

	const handleAnswer = useCallback(
		async (sdp: RTCSessionDescriptionInit) => {
			const peer = peerRef.current;
			if (!peer) return;

			await peer.setRemoteDescription(new RTCSessionDescription(sdp));
			await flushCandidates(peer);
		},
		[flushCandidates],
	);

	const handleIceCandidate = useCallback(
		async (candidate: RTCIceCandidateInit) => {
			const peer = peerRef.current;

			if (!peer || !peer.remoteDescription) {
				pendingCandidatesRef.current.push(candidate);
				return;
			}

			try {
				await peer.addIceCandidate(new RTCIceCandidate(candidate));
			} catch (err) {
				console.warn("ICE candidate rejected", err);
			}
		},
		[],
	);

	const toggleAudio = useCallback(() => {
		const tracks = localStreamRef.current?.getAudioTracks() ?? [];
		if (tracks.length === 0) return;

		const enabled = !tracks.every((track) => track.enabled);
		for (const track of tracks) track.enabled = enabled;
		setAudioEnabled(enabled);
		socket.current?.emit("rtc:media-toggle", { kind: "audio", enabled });
	}, [socket]);

	const toggleVideo = useCallback(() => {
		const tracks = localStreamRef.current?.getVideoTracks() ?? [];
		if (tracks.length === 0) return;

		const enabled = !tracks.every((track) => track.enabled);
		for (const track of tracks) track.enabled = enabled;
		setVideoEnabled(enabled);
		socket.current?.emit("rtc:media-toggle", { kind: "video", enabled });
	}, [socket]);

	useEffect(() => {
		return () => {
			peerRef.current?.close();
			peerRef.current = null;
			localStreamRef.current?.getTracks().forEach((track) => track.stop());
			localStreamRef.current = null;
		};
	}, []);

	return {
		localStream,
		audioEnabled,
		videoEnabled,
		startLocalStream,
		stopLocalStream,
		createOffer,
		handleOffer,
		handleAnswer,
		handleIceCandidate,
		toggleAudio,
		toggleVideo,
		closePeer,
		hasLocalStream,
	};
}
