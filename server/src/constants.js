export const PORT = process.env.PORT || 4000;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_OAUTH_SCOPE = "openid email profile";

export const SESSION_COOKIE = "faceflip_session";
export const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
export const SESSION_JWT_EXPIRY = "30d";

export const CLIENT_AUTH_PATH = "/auth";
export const CLIENT_AUTH_CALLBACK_PATH = "/auth/callback";

export const GENDER_VALUES = {
  male: "MALE",
  female: "FEMALE",
  random: "RANDOM",
};

export const SERVER_ERROR = "Something went wrong.";

export const GENDERS = ["male", "female", "other"];
export const GENDER_PREFERENCES = ["male", "female", "any"];
export const DEFAULT_GENDER = "other";
export const DEFAULT_GENDER_PREFERENCE = "any";

export const MEDIA_KINDS = ["audio", "video"];

export const MAX_CHAT_LENGTH = 500;
export const MAX_ROOM_MESSAGES = 200;
export const MAX_REPORT_DETAILS_LENGTH = 1000;

export const REPORT_REASONS = [
  "inappropriate",
  "spam",
  "harassment",
  "underage",
  "other",
];

export const STATS_INTERVAL_MS = 30_000;

export const MATCH_END_REASONS = {
  partnerLeft: "partner-left",
  partnerSkipped: "partner-skipped",
  partnerDisconnected: "partner-disconnected",
  blocked: "blocked",
};

export const SOCKET_ERRORS = {
  signInRequired: "Sign in to use friends.",
  noActivePartner: "You are not in a call.",
  notFriends: "You are not friends with this user.",
  offline: "That friend is offline.",
  busy: "That friend is already in a call.",
  youAreBusy: "You are already in a call.",
  noPendingCall: "That call is no longer available.",
  cannotFriendSelf: "You cannot add yourself.",
  guestPartner: "This person is browsing as a guest and can't be added.",
};

export const AUTH_ERRORS = {
  notSignedIn: "Not signed in.",
  invalidGender: "Invalid gender.",
  invalidGenderPref: "Invalid match preference.",
  nothingToUpdate: "Nothing to update.",
};
