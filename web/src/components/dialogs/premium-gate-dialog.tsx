"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import { PREMIUM_PLANS } from "@/constants";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { CornerBrackets } from "@/components/blueprint/corner-brackets";
import { PlanCard, type PlanCardData } from "@/components/premium/plan-card";
import { CheckoutDialog } from "./checkout-dialog";

interface PremiumGateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function PremiumGateDialog({ open, onOpenChange }: PremiumGateDialogProps) {
	const [checkoutPlan, setCheckoutPlan] = useState<PlanCardData | null>(null);

	const choose = (plan: PlanCardData) => {
		onOpenChange(false);
		setCheckoutPlan(plan);
	};

	const backToPlans = () => {
		setCheckoutPlan(null);
		onOpenChange(true);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-[480px] gap-0 px-5 pb-8 pt-11">
					<DialogHeader className="mb-6 items-center text-center">
						<div className="relative mb-5 flex h-[52px] w-[52px] items-center justify-center border border-accent-400 bg-accent-100">
							<CornerBrackets size={6} />
							<Crown className="h-[22px] w-[22px] text-accent" strokeWidth={1.5} />
						</div>
						<DialogTitle className="font-heading text-[26px] uppercase tracking-[0.01em]">
							Choose who you meet
						</DialogTitle>
						<DialogDescription className="mx-auto max-w-[320px]">
							Pick a plan to unlock gender-based matching. Without one, you
							match with Anyone.
						</DialogDescription>
					</DialogHeader>

					<div className="grid grid-cols-2 gap-4">
						{PREMIUM_PLANS.map((plan) => (
							<PlanCard key={plan.id} plan={plan} onChoose={choose} />
						))}
					</div>

					<button
						type="button"
						onClick={() => onOpenChange(false)}
						className="text-muted mt-5 cursor-pointer self-center bg-transparent text-[13px] underline-offset-2 hover:underline"
					>
						Maybe later
					</button>
				</DialogContent>
			</Dialog>

			<CheckoutDialog
				plan={checkoutPlan}
				onOpenChange={(open) => !open && setCheckoutPlan(null)}
				onSuccess={() => setCheckoutPlan(null)}
				onBack={backToPlans}
			/>
		</>
	);
}
