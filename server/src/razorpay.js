import { createHmac, timingSafeEqual } from "node:crypto";
import {
  RAZORPAY_CURRENCY,
  RAZORPAY_ORDERS_URL,
  RAZORPAY_REQUEST_TIMEOUT_MS,
} from "./constants.js";

export function isRazorpayConfigured() {
  return Boolean(
    process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.RAZORPAY_WEBHOOK_SECRET,
  );
}

export async function createRazorpayOrder({ amountPaise, receipt, notes }) {
  const credentials = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
  ).toString("base64");

  const res = await fetch(RAZORPAY_ORDERS_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: RAZORPAY_CURRENCY,
      receipt,
      notes,
    }),
    signal: AbortSignal.timeout(RAZORPAY_REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Razorpay order creation failed with status ${res.status}.`);
  }
  return res.json();
}

function signatureMatches(secret, data, signature) {
  if (typeof signature !== "string") return false;
  const expected = Buffer.from(
    createHmac("sha256", secret).update(data).digest("hex"),
  );
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function verifyCheckoutSignature({ orderId, paymentId, signature }) {
  return signatureMatches(
    process.env.RAZORPAY_KEY_SECRET,
    `${orderId}|${paymentId}`,
    signature,
  );
}

export function verifyWebhookSignature(rawBody, signature) {
  return (
    Boolean(rawBody) &&
    signatureMatches(process.env.RAZORPAY_WEBHOOK_SECRET, rawBody, signature)
  );
}
