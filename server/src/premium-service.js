import { Router } from "express";
import { prisma } from "./db.js";
import { AUTH_ERRORS, PREMIUM_PLANS } from "./constants.js";
import { getSessionUserId } from "./auth.js";
import { asyncRoute, isPremiumActive, withFriendCount } from "./helper.js";

export const premiumRouter = Router();

premiumRouter.post(
  "/checkout",
  asyncRoute(async (req, res) => {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ error: AUTH_ERRORS.notSignedIn });

    const plan = PREMIUM_PLANS[req.body?.plan];
    if (!plan) return res.status(400).json({ error: AUTH_ERRORS.invalidPlan });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(401).json({ error: AUTH_ERRORS.notSignedIn });

    const extendFrom = isPremiumActive(user) ? user.premiumExpiresAt : new Date();
    const premiumExpiresAt = new Date(
      extendFrom.getTime() + plan.days * 24 * 60 * 60 * 1000,
    );

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { premiumPlan: plan.code, premiumExpiresAt },
    });

    res.json({ user: await withFriendCount(updated) });
  }),
);
