import jwt from "jsonwebtoken";
import {
  GOOGLE_AUTH_URL,
  GOOGLE_OAUTH_SCOPE,
  GOOGLE_TOKEN_URL,
  SESSION_COOKIE,
  SESSION_JWT_EXPIRY,
  SESSION_MAX_AGE_MS,
} from "./constants.js";

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
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
  const token = req.cookies[SESSION_COOKIE];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET).sub;
  } catch {
    return null;
  }
}
