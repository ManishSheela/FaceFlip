import jwt from "jsonwebtoken";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export const SESSION_COOKIE = "faceflip_session";
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export const sessionCookieOptions = {
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
    scope: "openid email profile",
  });
  return `${AUTH_URL}?${params}`;
}

export async function exchangeCodeForProfile(code) {
  const res = await fetch(TOKEN_URL, {
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

export function signSession(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

export function verifySession(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET).sub;
  } catch {
    return null;
  }
}

export function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    gender: user.gender,
    ageConfirmed: user.ageConfirmed,
    genderPref: user.genderPref,
  };
}
