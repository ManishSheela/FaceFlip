import { APP_NAME, RAZORPAY_CHECKOUT_SCRIPT_URL } from "@/constants";

export interface RazorpayOrder {
	orderId: string;
	amountPaise: number;
	currency: string;
	keyId: string;
}

interface CheckoutDetails {
	description: string;
	prefill: { name: string; email: string };
}

export interface RazorpayPayment {
	orderId: string;
	paymentId: string;
	signature: string;
}

interface RazorpaySuccessResponse {
	razorpay_order_id: string;
	razorpay_payment_id: string;
	razorpay_signature: string;
}

interface RazorpayOptions {
	key: string;
	order_id: string;
	amount: number;
	currency: string;
	name: string;
	description: string;
	prefill: { name: string; email: string };
	handler: (response: RazorpaySuccessResponse) => void;
	modal: { ondismiss: () => void };
}

interface RazorpayInstance {
	open: () => void;
}

declare global {
	interface Window {
		Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
	}
}

let scriptPromise: Promise<void> | null = null;

function loadCheckoutScript(): Promise<void> {
	if (window.Razorpay) return Promise.resolve();
	if (scriptPromise) return scriptPromise;

	scriptPromise = new Promise<void>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = RAZORPAY_CHECKOUT_SCRIPT_URL;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => {
			script.remove();
			scriptPromise = null;
			reject(new Error("Razorpay checkout failed to load."));
		};
		document.body.appendChild(script);
	});
	return scriptPromise;
}

export async function openRazorpayCheckout(
	order: RazorpayOrder,
	{ description, prefill }: CheckoutDetails,
): Promise<RazorpayPayment | null> {
	await loadCheckoutScript();
	const Razorpay = window.Razorpay;
	if (!Razorpay) throw new Error("Razorpay checkout is unavailable.");

	return new Promise((resolve) => {
		new Razorpay({
			key: order.keyId,
			order_id: order.orderId,
			amount: order.amountPaise,
			currency: order.currency,
			name: APP_NAME,
			description,
			prefill,
			handler: (response) =>
				resolve({
					orderId: response.razorpay_order_id,
					paymentId: response.razorpay_payment_id,
					signature: response.razorpay_signature,
				}),
			modal: { ondismiss: () => resolve(null) },
		}).open();
	});
}
