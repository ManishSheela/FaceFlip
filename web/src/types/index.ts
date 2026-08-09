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

export type MatchStatus =
	| "idle"
	| "preparing"
	| "searching"
	| "matched"
	| "connected"
	| "ended";

export type MatchErrorCode =
	| "media-denied"
	| "media-unavailable"
	| "server-unreachable"
	| "connection-failed"
	| "partner-left";

export interface PartnerProfile {
	name: string | null;
	gender: UserGender | null;
}

export interface MatchInfo {
	roomId: string;
	partnerId: string;
	partner: PartnerProfile;
	initiator: boolean;
}

export interface QueueStats {
	waiting: number;
	active: number;
	online: number;
	position: number;
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

export type SignalData =
	| { kind: "description"; description: RTCSessionDescriptionInit }
	| { kind: "candidate"; candidate: RTCIceCandidateInit };
