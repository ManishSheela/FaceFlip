"use client";

import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { MAX_CHAT_LENGTH } from "@/constants";
import { useSocket } from "@/hooks/use-socket";
import { mediaErrorCode, useWebRtc } from "@/hooks/use-webrtc";
import type {
	CallRole,
	FriendRequestState,
	IncomingCall,
	IncomingFriendRequest,
	MatchErrorCode,
	MatchFilters,
	MatchFound,
	MatchSource,
	MatchStatus,
	MediaState,
	MediaKind,
	OutgoingCall,
	PartnerMedia,
	PartnerProfile,
	SearchStatus,
	SocketFriend,
	StrangerMessage,
} from "@/types";

const FULL_MEDIA: PartnerMedia = { audio: true, video: true };
const EMPTY_SEARCH: SearchStatus = { position: 0, waiting: 0, online: 0 };

export interface FaceFlipValue {
	isConnected: boolean;
	status: MatchStatus;
	matchSource: MatchSource | null;
	partner: PartnerProfile | null;
	error: MatchErrorCode | null;
	mediaState: MediaState;
	mediaError: MatchErrorCode | null;
	endedReason: string | null;
	search: SearchStatus;
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;
	audioEnabled: boolean;
	videoEnabled: boolean;
	partnerMedia: PartnerMedia;
	messages: StrangerMessage[];
	partnerTyping: boolean;
	friendRequestState: FriendRequestState | null;
	friends: SocketFriend[];
	incomingRequests: IncomingFriendRequest[];
	incomingCall: IncomingCall | null;
	outgoingCall: OutgoingCall | null;
	startSearching: (filters: MatchFilters) => void;
	ensureMedia: () => Promise<void>;
	skip: (filters: MatchFilters) => void;
	stop: () => void;
	sendMessage: (text: string) => void;
	sendTyping: (isTyping: boolean) => void;
	toggleAudio: () => void;
	toggleVideo: () => void;
	reportUser: (reason: string, details?: string) => void;
	blockAndSkip: () => void;
	sendFriendRequest: () => void;
	acceptRequest: (requestId: string) => void;
	rejectRequest: (requestId: string) => void;
	removeFriend: (friendUserId: string) => void;
	callFriend: (friendUserId: string) => void;
	cancelCall: () => void;
	acceptIncomingCall: () => void;
	rejectIncomingCall: () => void;
	refreshFriends: () => void;
}

export const FaceFlipContext = createContext<FaceFlipValue | null>(null);

export function FaceFlipProvider({ children }: { children: ReactNode }) {
	const { socket, isConnected, connectionFailed, emit, on } = useSocket();

	const [status, setStatus] = useState<MatchStatus>("idle");
	const [matchSource, setMatchSource] = useState<MatchSource | null>(null);
	const [partner, setPartner] = useState<PartnerProfile | null>(null);
	const [error, setError] = useState<MatchErrorCode | null>(null);
	const [mediaState, setMediaState] = useState<MediaState>("idle");
	const [mediaError, setMediaError] = useState<MatchErrorCode | null>(null);
	const [endedReason, setEndedReason] = useState<string | null>(null);
	const [search, setSearch] = useState<SearchStatus>(EMPTY_SEARCH);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const [partnerMedia, setPartnerMedia] = useState<PartnerMedia>(FULL_MEDIA);
	const [messages, setMessages] = useState<StrangerMessage[]>([]);
	const [partnerTyping, setPartnerTyping] = useState(false);
	const [friendRequestState, setFriendRequestState] =
		useState<FriendRequestState | null>(null);
	const [friends, setFriends] = useState<SocketFriend[]>([]);
	const [incomingRequests, setIncomingRequests] = useState<
		IncomingFriendRequest[]
	>([]);
	const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
	const [outgoingCall, setOutgoingCall] = useState<OutgoingCall | null>(null);

	const roleRef = useRef<CallRole | null>(null);
	const lastConnectedRef = useRef(false);
	const wasSearchingRef = useRef(false);
	const iceRef = useRef<RTCIceServer[]>([]);
	const filtersRef = useRef<MatchFilters>({
		gender: "other",
		preferGender: "any",
	});
	const inRoomRef = useRef(false);
	const pendingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);
	const handshakeStartedRef = useRef(false);
	const searchSessionRef = useRef(false);
	const statusRef = useRef<MatchStatus>("idle");
	statusRef.current = status;

	const handleFailed = useCallback(() => {
		setError("connection-failed");
	}, []);

	const handleRemoteStream = useCallback((stream: MediaStream) => {
		setRemoteStream(stream);
		setStatus("connected");
	}, []);

	const webrtc = useWebRtc({
		socket,
		onRemoteStream: handleRemoteStream,
		onFailed: handleFailed,
	});

	const {
		closePeer,
		createOffer,
		handleOffer,
		handleAnswer,
		handleIceCandidate,
		startLocalStream,
		stopLocalStream,
		hasLocalStream,
	} = webrtc;

	const startHandshake = useCallback(() => {
		if (handshakeStartedRef.current) return;
		if (!inRoomRef.current || !hasLocalStream()) return;

		handshakeStartedRef.current = true;

		if (roleRef.current === "initiator") {
			void createOffer(iceRef.current).catch(handleFailed);
			return;
		}

		const offer = pendingOfferRef.current;
		pendingOfferRef.current = null;
		if (offer) void handleOffer(offer, iceRef.current).catch(handleFailed);
	}, [createOffer, handleOffer, handleFailed, hasLocalStream]);

	const resetRoomState = useCallback(() => {
		inRoomRef.current = false;
		roleRef.current = null;
		pendingOfferRef.current = null;
		handshakeStartedRef.current = false;
		setRemoteStream(null);
		setMessages([]);
		setPartnerTyping(false);
		setPartnerMedia(FULL_MEDIA);
		setFriendRequestState(null);
		setMatchSource(null);
		setPartner(null);
	}, []);

	const teardownSession = useCallback(
		(options?: { keepMedia?: boolean }) => {
			const keepMedia = options?.keepMedia ?? false;
			closePeer();
			resetRoomState();
			setSearch(EMPTY_SEARCH);
			if (!keepMedia) {
				stopLocalStream();
				setMediaState("idle");
				setMediaError(null);
			}
		},
		[closePeer, resetRoomState, stopLocalStream],
	);

	useEffect(() => {
		if (connectionFailed) setError("server-unreachable");
	}, [connectionFailed]);

	useEffect(() => {
		if (isConnected) return;
		if (statusRef.current === "searching") wasSearchingRef.current = true;
		searchSessionRef.current = false;
		teardownSession();
		setEndedReason(null);
		setStatus("idle");
	}, [isConnected, teardownSession]);

	useEffect(() => {
		const wasConnected = lastConnectedRef.current;
		lastConnectedRef.current = isConnected;
		if (!isConnected || wasConnected) return;
		if (wasSearchingRef.current) {
			wasSearchingRef.current = false;
			searchSessionRef.current = true;
			setError(null);
			emit("match:find", filtersRef.current);
		}
	}, [isConnected, emit]);

	useEffect(() => {
		if (!isConnected) return;

		const cleanups = [
			on<SearchStatus>("match:searching", (payload) => {
				setSearch(payload ?? EMPTY_SEARCH);
				setStatus((prev) => (prev === "matched" || prev === "connected" ? prev : "searching"));
			}),

			on<MatchFound>("match:found", (payload) => {
				closePeer();
				resetRoomState();

				inRoomRef.current = true;
				roleRef.current = payload.role;
				iceRef.current = payload.iceServers ?? [];

				setPartner(payload.partner ?? null);
				setMatchSource(payload.source);
				setIncomingCall(null);
				setOutgoingCall(null);
				setError(null);
				setEndedReason(null);
				setStatus("matched");

				startHandshake();
			}),

			on<{ sdp: RTCSessionDescriptionInit }>("rtc:offer", (payload) => {
				if (!handshakeStartedRef.current || !hasLocalStream()) {
					pendingOfferRef.current = payload.sdp;
					return;
				}
				void handleOffer(payload.sdp, iceRef.current).catch(handleFailed);
			}),

			on<{ sdp: RTCSessionDescriptionInit }>("rtc:answer", (payload) => {
				void handleAnswer(payload.sdp).catch(handleFailed);
			}),

			on<{ candidate: RTCIceCandidateInit }>("rtc:ice-candidate", (payload) => {
				void handleIceCandidate(payload.candidate);
			}),

			on<{ kind: MediaKind; enabled: boolean }>(
				"rtc:media-toggle",
				({ kind, enabled }) => {
					setPartnerMedia((prev) => ({ ...prev, [kind]: enabled }));
				},
			),

			on<Omit<StrangerMessage, "fromSelf">>("chat:message", (message) => {
				setPartnerTyping(false);
				setMessages((prev) => [...prev, { ...message, fromSelf: false }]);
			}),

			on<{ isTyping: boolean }>("chat:typing", ({ isTyping }) => {
				setPartnerTyping(isTyping === true);
			}),

			on<{ reason: string }>("match:ended", ({ reason }) => {
				searchSessionRef.current = false;
				teardownSession({ keepMedia: true });
				setEndedReason(reason ?? null);
				setStatus("idle");
			}),

			on("match:cancelled", () => {
				searchSessionRef.current = false;
				teardownSession();
				setStatus("idle");
			}),

			on<{ status: FriendRequestState }>("friend:request-sent", (result) => {
				setFriendRequestState(result?.status ?? null);
			}),

			on("friend:request-accepted", () => {
				setFriendRequestState("accepted");
				emit("friend:list");
			}),

			on<IncomingFriendRequest>("friend:request-received", (request) => {
				setIncomingRequests((prev) =>
					prev.some((r) => r.id === request.id) ? prev : [...prev, request],
				);
			}),

			on<{ friends: SocketFriend[] }>("friend:list-result", (payload) => {
				setFriends(payload?.friends ?? []);
			}),

			on<{ requests: IncomingFriendRequest[] }>(
				"friend:incoming-requests-result",
				(payload) => setIncomingRequests(payload?.requests ?? []),
			),

			on("friend:accepted", () => emit("friend:list")),
			on("friend:removed", () => emit("friend:list")),

			on<IncomingCall>("friend:incoming-call", (payload) => {
				setIncomingCall(payload);
			}),

			on("friend:call-cancelled", () => setIncomingCall(null)),

			on<{ friendUserId: string }>("friend:call-ringing", (payload) => {
				setOutgoingCall({ friendUserId: payload.friendUserId, status: "ringing" });
			}),

			on("friend:call-rejected", () => {
				setOutgoingCall((prev) =>
					prev ? { ...prev, status: "rejected" } : null,
				);
			}),

			on<{ reason: string }>("friend:call-error", ({ reason }) => {
				setOutgoingCall({ friendUserId: null, status: "error", reason });
			}),
		];

		emit("friend:list");
		emit("friend:incoming-requests");

		return () => cleanups.forEach((cleanup) => cleanup());
	}, [
		isConnected,
		on,
		emit,
		teardownSession,
		closePeer,
		handleOffer,
		handleAnswer,
		handleIceCandidate,
		handleFailed,
		hasLocalStream,
		resetRoomState,
		startHandshake,
	]);

	useEffect(() => {
		if (!outgoingCall) return;
		if (outgoingCall.status !== "rejected" && outgoingCall.status !== "error") {
			return;
		}

		const id = setTimeout(() => setOutgoingCall(null), 2500);
		return () => clearTimeout(id);
	}, [outgoingCall]);

	const ensureMedia = useCallback(async () => {
		if (hasLocalStream()) {
			setMediaState("ready");
			startHandshake();
			return;
		}

		setMediaError(null);
		setMediaState("requesting");

		try {
			await startLocalStream();
			setMediaState("ready");
			startHandshake();
		} catch (err) {
			setMediaError(mediaErrorCode(err));
			setMediaState("error");
		}
	}, [hasLocalStream, startHandshake, startLocalStream]);

	const startSearching = useCallback(
		(filters: MatchFilters) => {
			if (searchSessionRef.current) return;
			if (statusRef.current === "matched" || statusRef.current === "connected") {
				return;
			}

			searchSessionRef.current = true;
			wasSearchingRef.current = false;
			filtersRef.current = filters;
			setError(null);
			setEndedReason(null);
			setStatus("searching");
			emit("match:find", filters);
		},
		[emit],
	);

	const skip = useCallback(
		(filters: MatchFilters) => {
			searchSessionRef.current = true;
			wasSearchingRef.current = false;
			filtersRef.current = filters;
			teardownSession({ keepMedia: true });
			setEndedReason(null);
			setStatus("searching");
			emit("match:skip", filters);
		},
		[teardownSession, emit],
	);

	const stop = useCallback(() => {
		searchSessionRef.current = false;
		wasSearchingRef.current = false;
		emit("match:cancel");
		teardownSession();
		setEndedReason(null);
		setStatus("idle");
	}, [emit, teardownSession]);

	const sendMessage = useCallback(
		(text: string) => {
			const trimmed = text.trim().slice(0, MAX_CHAT_LENGTH);
			if (!trimmed || !inRoomRef.current) return;

			emit("chat:message", { text: trimmed });
			setMessages((prev) => [
				...prev,
				{
					id: `self-${Date.now()}`,
					text: trimmed,
					timestamp: Date.now(),
					fromSelf: true,
				},
			]);
		},
		[emit],
	);

	const sendTyping = useCallback(
		(isTyping: boolean) => {
			if (inRoomRef.current) emit("chat:typing", { isTyping });
		},
		[emit],
	);

	const reportUser = useCallback(
		(reason: string, details?: string) => emit("user:report", { reason, details }),
		[emit],
	);

	const blockAndSkip = useCallback(() => emit("user:block-and-skip"), [emit]);

	const sendFriendRequest = useCallback(() => {
		setFriendRequestState("sending");
		emit("friend:request");
	}, [emit]);

	const acceptRequest = useCallback(
		(requestId: string) => {
			emit("friend:accept", { requestId });
			setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
		},
		[emit],
	);

	const rejectRequest = useCallback(
		(requestId: string) => {
			emit("friend:reject", { requestId });
			setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
		},
		[emit],
	);

	const removeFriend = useCallback(
		(friendUserId: string) => emit("friend:remove", { friendUserId }),
		[emit],
	);

	const callFriend = useCallback(
		(friendUserId: string) => {
			setOutgoingCall({ friendUserId, status: "calling" });
			emit("friend:call", { friendUserId });
		},
		[emit],
	);

	const cancelCall = useCallback(() => {
		if (outgoingCall?.friendUserId) {
			emit("friend:call-cancel", { friendUserId: outgoingCall.friendUserId });
		}
		setOutgoingCall(null);
	}, [emit, outgoingCall]);

	const acceptIncomingCall = useCallback(() => {
		emit("friend:call-accept");
		setIncomingCall(null);
	}, [emit]);

	const rejectIncomingCall = useCallback(() => {
		emit("friend:call-reject");
		setIncomingCall(null);
	}, [emit]);

	const refreshFriends = useCallback(() => {
		emit("friend:list");
		emit("friend:incoming-requests");
	}, [emit]);

	const value = useMemo<FaceFlipValue>(
		() => ({
			isConnected,
			status,
			matchSource,
			partner,
			error,
			mediaState,
			mediaError,
			endedReason,
			search,
			localStream: webrtc.localStream,
			remoteStream,
			audioEnabled: webrtc.audioEnabled,
			videoEnabled: webrtc.videoEnabled,
			partnerMedia,
			messages,
			partnerTyping,
			friendRequestState,
			friends,
			incomingRequests,
			incomingCall,
			outgoingCall,
			startSearching,
			ensureMedia,
			skip,
			stop,
			sendMessage,
			sendTyping,
			toggleAudio: webrtc.toggleAudio,
			toggleVideo: webrtc.toggleVideo,
			reportUser,
			blockAndSkip,
			sendFriendRequest,
			acceptRequest,
			rejectRequest,
			removeFriend,
			callFriend,
			cancelCall,
			acceptIncomingCall,
			rejectIncomingCall,
			refreshFriends,
		}),
		[
			isConnected,
			status,
			matchSource,
			partner,
			error,
			mediaState,
			mediaError,
			endedReason,
			search,
			webrtc.localStream,
			remoteStream,
			webrtc.audioEnabled,
			webrtc.videoEnabled,
			webrtc.toggleAudio,
			webrtc.toggleVideo,
			partnerMedia,
			messages,
			partnerTyping,
			friendRequestState,
			friends,
			incomingRequests,
			incomingCall,
			outgoingCall,
			startSearching,
			ensureMedia,
			skip,
			stop,
			sendMessage,
			sendTyping,
			reportUser,
			blockAndSkip,
			sendFriendRequest,
			acceptRequest,
			rejectRequest,
			removeFriend,
			callFriend,
			cancelCall,
			acceptIncomingCall,
			rejectIncomingCall,
			refreshFriends,
		],
	);

	return (
		<FaceFlipContext.Provider value={value}>{children}</FaceFlipContext.Provider>
	);
}
