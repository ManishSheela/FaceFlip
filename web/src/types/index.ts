export type Theme = "light" | "dark";

export type GenderPref = "male" | "female" | "random";

export type UserGender = "male" | "female" | "random";

export type CallType = "video" | "voice";

export type ReportReason = "spam" | "inappropriate" | "underage" | "other";

export interface Friend {
	id: number;
	name: string;
	initials: string;
	online: boolean;
}

export interface FriendRequest {
	id: number;
	name: string;
	initials: string;
}

export interface ChatMessage {
	id: number;
	text: string;
	isMe: boolean;
}

export interface FeatureCard {
	kicker: string;
	title: string;
	body: string;
}

export interface DeviceOption {
	label: string;
	value: string;
}

export interface GoogleProfile {
	id: string;
	name: string;
	email: string;
	picture: string | null;
	gender: UserGender | null;
	genderPref: GenderPref;
	friendCount: number;
}

export interface ServerSession {
	user: GoogleProfile | null;
	resolved: boolean;
}

export type SocketGender = "male" | "female" | "other";

export type GenderPreference = "male" | "female" | "any";

export type MatchStatus = "idle" | "searching" | "matched" | "connected";

export type MediaState = "idle" | "requesting" | "ready" | "error";

export type MatchSource = "random" | "friend";

export type CallRole = "initiator" | "responder";

export type MatchErrorCode =
	| "media-denied"
	| "media-unavailable"
	| "server-unreachable"
	| "connection-failed";

export interface MatchFilters {
	gender: SocketGender;
	preferGender: GenderPreference;
}

export interface PartnerProfile {
	name: string | null;
	gender: SocketGender | null;
	isGuest: boolean;
}

export interface MatchFound {
	roomId: string;
	role: CallRole;
	partnerId: string;
	partner: PartnerProfile;
	source: MatchSource;
	iceServers: RTCIceServer[];
}

export interface SearchStatus {
	position: number;
	waiting: number;
	online: number;
}

export interface StrangerMessage {
	id: string;
	text: string;
	timestamp: number;
	fromSelf: boolean;
}

export interface PartnerMedia {
	audio: boolean;
	video: boolean;
}

export type MediaKind = keyof PartnerMedia;

export interface SocketFriend {
	userId: string;
	name: string;
	picture: string | null;
	online: boolean;
}

export interface IncomingFriendRequest {
	id: string;
	fromUserId: string;
	name: string | null;
	picture?: string | null;
}

export interface IncomingCall {
	fromUserId: string;
	name: string | null;
}

export type OutgoingCallStatus = "calling" | "ringing" | "rejected" | "error";

export interface OutgoingCall {
	friendUserId: string | null;
	status: OutgoingCallStatus;
	reason?: string;
}

export type FriendRequestState =
	| "sending"
	| "sent"
	| "already-friends"
	| "already-pending"
	| "auto-accepted"
	| "accepted"
	| "error";
