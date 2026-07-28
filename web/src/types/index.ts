export type Theme = "light" | "dark";

export type GenderPref = "male" | "female" | "random";

export type UserGender = "male" | "female" | "other";

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
