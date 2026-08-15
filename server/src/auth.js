import jwt from "jsonwebtoken";
import {
  GOOGLE_AUTH_URL,
  GOOGLE_OAUTH_SCOPE,
  GOOGLE_TOKEN_URL,
  SESSION_COOKIE,
  SESSION_JWT_EXPIRY,
  SESSION_MAX_AGE_MS,
} from "./constants.js";

const isProduction = process.env.NODE_ENV === "production";

// Frontend and backend run on different domains in production, so the
// session cookie needs SameSite=None (which browsers require pairing with
// Secure) to be sent on cross-site fetch/XHR requests from the client.
const sessionCookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  maxAge: SESSION_MAX_AGE_MS,
};

export function googleAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: GOOGLE_OAUTH_SCOPE,
  });
  return `${GOOGLE_AUTH_URL}?${params}`;
}

export async function exchangeCodeForProfile(code) {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error("Google rejected the sign-in code.");

  const { id_token } = await res.json();
  const claims = jwt.decode(id_token);
  if (!claims?.sub) throw new Error("Google returned an unreadable ID token.");

  return {
    googleId: claims.sub,
    name: claims.name ?? "",
    email: claims.email ?? "",
    picture: claims.picture ?? null,
  };
}

export function setSessionCookie(res, userId) {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: SESSION_JWT_EXPIRY,
  });
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions);
}

export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions);
}

export function getSessionUserId(req) {
  return verifySessionToken(req.cookies?.[SESSION_COOKIE]);
}

export function getSessionUserIdFromCookieHeader(header) {
  if (typeof header !== "string" || header.length === 0) return null;

  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;

    if (part.slice(0, separator).trim() !== SESSION_COOKIE) continue;
    return verifySessionToken(decodeURIComponent(part.slice(separator + 1)));
  }
  return null;
}

function verifySessionToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET).sub;
  } catch {
    return null;
  }
}
