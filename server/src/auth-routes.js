import { Router } from "express";
import { prisma } from "./db.js";
import { CLIENT_ORIGIN, SESSION_COOKIE } from "./constants.js";
import {
  exchangeCodeForProfile,
  googleAuthUrl,
  sessionCookieOptions,
  signSession,
  toPublicUser,
  verifySession,
} from "./auth.js";

export const authRouter = Router();

authRouter.get("/google", (_req, res) => res.redirect(googleAuthUrl()));

authRouter.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`${CLIENT_ORIGIN}/auth?error=cancelled`);

  try {
    const profile = await exchangeCodeForProfile(code);

    const user = await prisma.user.upsert({
      where: { googleId: profile.googleId },
      update: { name: profile.name, email: profile.email, picture: profile.picture },
      create: profile,
    });

    res.cookie(SESSION_COOKIE, signSession(user.id), sessionCookieOptions);
    res.redirect(`${CLIENT_ORIGIN}/auth/callback`);
  } catch {
    res.redirect(`${CLIENT_ORIGIN}/auth?error=failed`);
  }
});

authRouter.get("/me", async (req, res) => {
  const userId = verifySession(req.cookies[SESSION_COOKIE]);
  if (!userId) return res.status(401).json({ error: "Not signed in." });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(401).json({ error: "Not signed in." });

  const friendCount = await prisma.friendship.count({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
  });

  res.json({ user: { ...toPublicUser(user), friendCount } });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions);
  res.json({ ok: true });
});
