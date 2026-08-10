import type {
	DeviceOption,
	FeatureCard,
	GenderPref,
	GenderPreference,
	MatchErrorCode,
	SocketGender,
	ReportReason,
	Theme,
	UserGender,
} from "@/types";

export * from "./routes";

export const APP_NAME = "FaceFliip";

export const THEME_STORAGE_KEY = "faceflip-theme";

export const AGE_CONFIRMED_STORAGE_KEY = "faceflip-age-confirmed";

export const BLUEPRINT_CORNERS = ["tl", "tr", "bl", "br"] as const;

export const API_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const SESSION_COOKIE = "faceflip_session";

export const REQUEST_TIMEOUT_MS = 15000;

export const CHAT_REPLY_DELAY_MS = 1000;

export const REPORT_AUTOCLOSE_MS = 1600;

export const MAX_CHAT_LENGTH = 500;

export const TYPING_IDLE_MS = 1500;

export const MEDIA_CONSTRAINTS: MediaStreamConstraints = {
	video: { width: { ideal: 1280 }, height: { ideal: 720 } },
	audio: { echoCancellation: true, noiseSuppression: true },
};

export const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
	{ urls: "stun:stun.l.google.com:19302" },
];

export const MATCH_ERROR_MESSAGES: Record<MatchErrorCode, string> = {
	"media-denied":
		"Camera and microphone access was blocked. Allow access to start matching.",
	"media-unavailable":
		"No camera or microphone was found. Connect a device and try again.",
	"server-unreachable":
		"Can't reach the matching server. Check your connection and try again.",
	"connection-failed":
		"The connection to your match dropped. Search again to find someone new.",
};

export const MATCH_END_MESSAGES: Record<string, string> = {
	"partner-left": "Your match left.",
	"partner-skipped": "Your match moved on.",
	"partner-disconnected": "Your match disconnected.",
	blocked: "You blocked this user.",
};

export const MEDIA_CONSTRAINTS_FACING = "user";

export const GENDER_TO_SOCKET: Record<UserGender, SocketGender> = {
	male: "male",
	female: "female",
	random: "other",
};

export const PREF_TO_SOCKET: Record<GenderPref, GenderPreference> = {
	male: "male",
	female: "female",
	random: "any",
};

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
	{ label: "Random", value: "random" },
];

export const THEME_OPTIONS: { label: string; value: Theme }[] = [
	{ label: "Light", value: "light" },
	{ label: "Dark", value: "dark" },
];

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
	cancelled: "Google sign-in was cancelled.",
	failed: "Couldn't complete Google sign-in. Please try again.",
};

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

export const REMOTE_GRADIENT =
  "linear-gradient(135deg, var(--color-accent-900), var(--color-accent-700), var(--color-accent-800))";
export const LOCAL_GRADIENT =
  "linear-gradient(225deg, var(--color-accent-800), var(--color-accent-900), var(--color-accent-700))";

export const GENDER_COLORS: Record<SocketGender, string> = {
  male: "#3b82f6",
  female: "#ec4899",
  other: "#eab308",
};

export const GENDER_BADGE_LABELS: Record<SocketGender, string> = {
  male: "Male",
  female: "Female",
  other: "Unspecified",
};
