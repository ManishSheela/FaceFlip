"use client";

import { useState } from "react";
import { ArrowLeft, CreditCard, Grid3x3, Shield, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSessionActions } from "@/hooks/use-session";
import type { PremiumPlanId } from "@/types";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CornerBrackets } from "@/components/blueprint/corner-brackets";

export interface CheckoutPlan {
	id: PremiumPlanId;
	label: string;
	priceLabel: string;
	period: string;
}

type PaymentMethod = "upi" | "card" | "qr";

const PAYMENT_METHODS: {
	id: PaymentMethod;
	label: string;
	description: string;
	icon: typeof Smartphone;
}[] = [
	{ id: "upi", label: "UPI", description: "GPay, PhonePe, Paytm & more", icon: Smartphone },
	{ id: "card", label: "Credit / debit card", description: "Visa, Mastercard, RuPay", icon: CreditCard },
	{ id: "qr", label: "Scan QR code", description: "Any UPI app on your phone", icon: Grid3x3 },
];

const QR_ON_CELLS = new Set([
	0, 1, 2, 3, 4, 5, 6, 9, 15, 18, 24, 27, 28, 29, 30, 31, 32, 33, 36, 42, 45, 51, 54, 55, 56, 57,
	58, 59, 60, 63, 69, 72, 73, 74, 75, 76, 77, 78,
]);

interface CheckoutDialogProps {
	plan: CheckoutPlan | null;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
	/** Returns to plan selection instead of closing the flow outright. */
	onBack: () => void;
}

export function CheckoutDialog({ plan, onOpenChange, onSuccess, onBack }: CheckoutDialogProps) {
	const { purchasePremium } = useSessionActions();
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
	const [submitting, setSubmitting] = useState(false);

	const pay = async () => {
		if (!plan) return;
		setSubmitting(true);
		const ok = await purchasePremium(plan.id);
		setSubmitting(false);
		if (ok) onSuccess();
	};

	return (
		<Dialog open={plan !== null} onOpenChange={(open) => !submitting && onOpenChange(open)}>
			<DialogContent
				showClose={!submitting}
				className="max-w-[480px] gap-0 px-5 pb-5 pt-9"
			>
				<button
					type="button"
					onClick={onBack}
					disabled={submitting}
					className="absolute left-3 top-3 flex items-center gap-1.5 border-none bg-transparent p-1 font-heading text-[11px] uppercase tracking-[0.05em] text-muted disabled:opacity-45"
				>
					<ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
					Back
				</button>

				<DialogHeader className="mb-5 mt-2">
					<div className="relative flex items-center justify-between border border-divider p-3.5">
						<CornerBrackets size={6} color="var(--color-accent-400)" />
						<div>
							<div className="font-heading text-[11px] uppercase tracking-[0.1em] text-muted">
								Selected plan
							</div>
							<DialogTitle className="text-lg">{plan?.label}</DialogTitle>
						</div>
						<div className="text-right">
							<div className="font-heading text-2xl font-bold leading-none">
								{plan?.priceLabel}
							</div>
							<div className="text-muted text-[11px]">{plan?.period}</div>
						</div>
					</div>
				</DialogHeader>

				<h3 className="mb-2.5 font-heading text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">
					Payment method
				</h3>

				<div className="flex flex-col gap-2">
					{PAYMENT_METHODS.map((method) => {
						const active = method.id === paymentMethod;
						const Icon = method.icon;
						return (
							<button
								key={method.id}
								type="button"
								onClick={() => setPaymentMethod(method.id)}
								className={cn(
									"flex items-center gap-3.5 border p-3.5 text-left transition-colors",
									active ? "border-accent bg-accent-100" : "border-divider hover:bg-accent-100",
								)}
							>
								<span className="flex h-9 w-9 flex-none items-center justify-center border border-divider">
									<Icon className="h-[18px] w-[18px] text-accent" strokeWidth={1.5} />
								</span>
								<span className="flex-1">
									<span className="block font-heading text-sm font-semibold">
										{method.label}
									</span>
									<span className="text-muted block text-xs">{method.description}</span>
								</span>
							</button>
						);
					})}
				</div>

				{paymentMethod === "qr" && (
					<div className="relative mt-4 flex flex-col items-center gap-2.5 border border-accent-400 bg-accent-100 p-5">
						<CornerBrackets size={6} />
						<div
							className="grid gap-px border border-accent-400 p-2"
							style={{ width: 120, height: 120, gridTemplateColumns: "repeat(9, 1fr)" }}
						>
							{Array.from({ length: 81 }, (_, i) => (
								<div
									key={i}
									className={QR_ON_CELLS.has(i) ? "bg-text" : "bg-transparent"}
								/>
							))}
						</div>
						<p className="text-muted m-0 text-center text-xs">
							Scan with any UPI app
							<br />
							to pay {plan?.priceLabel}
						</p>
					</div>
				)}

				{paymentMethod === "card" && (
					<div className="mt-4 flex flex-col gap-2.5">
						<div className="flex flex-col gap-1">
							<Label>Card number</Label>
							<Input placeholder="0000 0000 0000 0000" />
						</div>
						<div className="grid grid-cols-2 gap-2.5">
							<div className="flex flex-col gap-1">
								<Label>Expiry</Label>
								<Input placeholder="MM / YY" />
							</div>
							<div className="flex flex-col gap-1">
								<Label>CVV</Label>
								<Input placeholder="•••" />
							</div>
						</div>
					</div>
				)}

				<Button
					variant="primary"
					block
					className="mt-5 justify-center rounded-none border-amber bg-amber text-white hover:opacity-90"
					onClick={() => void pay()}
					disabled={submitting}
				>
					{submitting ? "Processing…" : `Pay ${plan?.priceLabel ?? ""}`}
				</Button>

				<div className="mt-3 flex items-center justify-center gap-1.5">
					<Shield className="h-3 w-3 text-muted" strokeWidth={1.5} />
					<span className="text-muted text-[11px]">Secured by 256-bit encryption</span>
				</div>
			</DialogContent>
		</Dialog>
	);
}
