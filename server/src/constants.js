export const PORT = process.env.PORT || 4000;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

export const STUN_SERVER_URL = "stun:stun.l.google.com:19302";

export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_OAUTH_SCOPE = "openid email profile";

export const SESSION_COOKIE = "faceflip_session";
export const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
export const SESSION_JWT_EXPIRY = "30d";
