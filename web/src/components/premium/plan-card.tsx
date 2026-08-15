"use client";

import { cn } from "@/lib/utils";
import { CornerBrackets } from "@/components/blueprint/corner-brackets";
import { Button } from "@/components/ui/button";
import type { PremiumPlanId } from "@/types";

export interface PlanCardData {
	id: PremiumPlanId;
	label: string;
	priceLabel: string;
	period: string;
	badge?: string;
}

interface PlanCardProps {
	plan: PlanCardData;
	onChoose: (plan: PlanCardData) => void;
}

export function PlanCard({ plan, onChoose }: PlanCardProps) {
	const highlighted = Boolean(plan.badge);

	return (
		<div
			className={cn(
				"relative flex flex-col gap-3 border p-5",
				highlighted ? "border-accent-400 bg-accent-100" : "border-divider",
			)}
		>
			<CornerBrackets color={highlighted ? "var(--color-accent)" : "var(--color-divider)"} />
			{plan.badge && (
				<span className="absolute -top-2.5 right-3 bg-accent px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-[0.08em] text-on-accent">
					{plan.badge}
				</span>
			)}
			<span className="font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
				{plan.label}
			</span>
			<span className="flex items-baseline gap-1">
				<span className="font-heading text-3xl font-bold">{plan.priceLabel}</span>
				<span className="text-muted text-xs">{plan.period}</span>
			</span>
			<Button
				variant="primary"
				block
				className="justify-center rounded-none"
				onClick={() => onChoose(plan)}
			>
				Choose
			</Button>
		</div>
	);
}
