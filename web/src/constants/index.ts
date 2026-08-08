import type {
	DeviceOption,
	FeatureCard,
	GenderPref,
	ReportReason,
	UserGender,
} from "@/types";

export * from "./routes";

export const APP_NAME = "FaceFliip";

export const API_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const SESSION_COOKIE = "faceflip_session";

export const REQUEST_TIMEOUT_MS = 15000;

export const MATCHING_DURATION_SEC = 3;

export const CONNECT_DELAY_MS = 1000;

export const ONLINE_COUNT = "12,847";

export const FEATURE_CARDS: FeatureCard[] = [
	{
		kicker: "Safe",
		title: "Moderated",
		body: "Report tools keep every session respectful.",
	},
	{
		kicker: "Fast",
		title: "Instant match",
		body: "Skip the queue and connect right away.",
	},
	{
		kicker: "Open",
		title: "No signup",
		body: "Jump in as a guest, no account needed.",
	},
];

export const GENDER_PREF_LABELS: Record<GenderPref, string> = {
	male: "Male",
	female: "Female",
	random: "Anyone",
};

export const GENDER_PREF_OPTIONS: { label: string; value: GenderPref }[] = (
	["male", "female", "random"] as const
).map((value) => ({ label: GENDER_PREF_LABELS[value], value }));

export const USER_GENDER_OPTIONS: { label: string; value: UserGender }[] = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
	{ label: "Other", value: "other" },
];

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
	{ value: "spam", label: "Spam or advertising" },
	{ value: "inappropriate", label: "Inappropriate content" },
	{ value: "underage", label: "Underage user" },
	{ value: "other", label: "Other" },
];

export const RANDOM_FRIEND_NAMES = [
	"Luna Park",
	"Kai Torres",
	"River Stone",
	"Sam Fox",
	"Noa Blake",
];

export const CHAT_AUTO_REPLIES = [
	"Got it!",
	"Sounds good.",
	"Let's catch up soon!",
	"Nice talking to you!",
];

export const CAMERA_DEVICES: DeviceOption[] = [
	{ label: "Built-in camera", value: "Built-in camera" },
	{ label: "External webcam", value: "External webcam" },
];

export const MICROPHONE_DEVICES: DeviceOption[] = [
	{ label: "Built-in microphone", value: "Built-in microphone" },
	{ label: "Headset mic", value: "Headset mic" },
];
