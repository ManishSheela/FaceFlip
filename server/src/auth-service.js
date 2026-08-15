import { Router } from "express";
import { prisma } from "./db.js";
import { AUTH_ERRORS } from "./constants.js";
import {
  clearSessionCookie,
  exchangeCodeForProfile,
  getSessionUserId,
  googleAuthUrl,
  setSessionCookie,
} from "./auth.js";
import {
  asyncRoute,
  buildProfileUpdate,
  clientAuthUrl,
  withFriendCount,
} from "./helper.js";

export const authRouter = Router();

authRouter.get("/google", (_req, res) => res.redirect(googleAuthUrl()));

authRouter.get(
  "/google/callback",
  asyncRoute(async (req, res) => {
    const { code } = req.query;
    if (!code) return res.redirect(clientAuthUrl("cancelled"));

    try {
      const profile = await exchangeCodeForProfile(code);

      const user = await prisma.user.upsert({
        where: { googleId: profile.googleId },
        update: {
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
        },
        create: profile,
      });

      setSessionCookie(res, user.id);
      res.redirect(clientAuthUrl());
    } catch {
      res.redirect(clientAuthUrl("failed"));
    }
  }),
);

authRouter.get(
  "/me",
  asyncRoute(async (req, res) => {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ error: AUTH_ERRORS.notSignedIn });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(401).json({ error: AUTH_ERRORS.notSignedIn });

    res.json({ user: await withFriendCount(user) });
  }),
);

authRouter.patch(
  "/me",
  asyncRoute(async (req, res) => {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ error: AUTH_ERRORS.notSignedIn });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(401).json({ error: AUTH_ERRORS.notSignedIn });

    const { data, error } = buildProfileUpdate(user, req.body ?? {});
    if (error) return res.status(400).json({ error });

    const updated = await prisma.user.update({ where: { id: userId }, data });
    res.json({ user: await withFriendCount(updated) });
  }),
);

authRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});
