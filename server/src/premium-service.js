import { randomUUID } from "node:crypto";
import { Router } from "express";
import { prisma } from "./db.js";
import {
  AUTH_ERRORS,
  MS_PER_DAY,
  PAYMENT_STATUS,
  PREMIUM_PLANS,
  RAZORPAY_CURRENCY,
  RAZORPAY_ORDER_PAID_EVENT,
  RAZORPAY_SIGNATURE_HEADER,
} from "./constants.js";
import { getSessionUserId } from "./auth.js";
import { asyncRoute, isPremiumActive, withFriendCount } from "./helper.js";
import {
  createRazorpayOrder,
  isRazorpayConfigured,
  verifyCheckoutSignature,
  verifyWebhookSignature,
} from "./razorpay.js";

export const premiumRouter = Router();

function planByCode(code) {
  return Object.values(PREMIUM_PLANS).find((plan) => plan.code === code);
}

async function markPaidAndGrantPremium(orderId, paymentId) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { razorpayOrderId: orderId },
    });
    if (!payment) return false;

    const claimed = await tx.payment.updateMany({
      where: { id: payment.id, status: PAYMENT_STATUS.created },
      data: {
        status: PAYMENT_STATUS.paid,
        razorpayPaymentId: paymentId,
        paidAt: new Date(),
      },
    });
    if (claimed.count === 0) return true;

    const user = await tx.user.findUnique({ where: { id: payment.userId } });
    const extendFrom = isPremiumActive(user) ? user.premiumExpiresAt : new Date();
    const days = planByCode(payment.plan).days;

    await tx.user.update({
      where: { id: user.id },
      data: {
        premiumPlan: payment.plan,
        premiumExpiresAt: new Date(extendFrom.getTime() + days * MS_PER_DAY),
      },
    });
    return true;
  });
}

premiumRouter.post(
  "/orders",
  asyncRoute(async (req, res) => {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ error: AUTH_ERRORS.notSignedIn });

    const plan = Object.hasOwn(PREMIUM_PLANS, req.body?.plan)
      ? PREMIUM_PLANS[req.body.plan]
      : null;
    if (!plan) return res.status(400).json({ error: AUTH_ERRORS.invalidPlan });

    if (!isRazorpayConfigured()) {
      return res.status(503).json({ error: AUTH_ERRORS.paymentsUnavailable });
    }

    const order = await createRazorpayOrder({
      amountPaise: plan.amountPaise,
      receipt: randomUUID(),
      notes: { userId, plan: plan.code },
    });

    await prisma.payment.create({
      data: {
        userId,
        plan: plan.code,
        amountPaise: plan.amountPaise,
        razorpayOrderId: order.id,
      },
    });

    res.json({
      orderId: order.id,
      amountPaise: plan.amountPaise,
      currency: RAZORPAY_CURRENCY,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  }),
);

premiumRouter.post(
  "/verify",
  asyncRoute(async (req, res) => {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ error: AUTH_ERRORS.notSignedIn });

    const { orderId, paymentId, signature } = req.body ?? {};
    if (
      typeof orderId !== "string" ||
      typeof paymentId !== "string" ||
      !verifyCheckoutSignature({ orderId, paymentId, signature })
    ) {
      return res.status(400).json({ error: AUTH_ERRORS.invalidPayment });
    }

    if (!(await markPaidAndGrantPremium(orderId, paymentId))) {
      return res.status(404).json({ error: AUTH_ERRORS.paymentNotFound });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    res.json({ user: await withFriendCount(user) });
  }),
);

premiumRouter.post(
  "/webhook",
  asyncRoute(async (req, res) => {
    if (!verifyWebhookSignature(req.rawBody, req.get(RAZORPAY_SIGNATURE_HEADER))) {
      return res.status(400).json({ error: AUTH_ERRORS.invalidPayment });
    }

    const { event, payload } = req.body ?? {};
    const orderId = payload?.order?.entity?.id;
    const paymentId = payload?.payment?.entity?.id;

    if (event === RAZORPAY_ORDER_PAID_EVENT && orderId && paymentId) {
      const found = await markPaidAndGrantPremium(orderId, paymentId);
      if (!found) console.error(`Razorpay webhook for unknown order ${orderId}`);
    }

    res.json({ ok: true });
  }),
);
