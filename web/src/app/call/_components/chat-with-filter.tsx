"use client";

import { Lock } from "lucide-react";
import { GENDER_PREF_OPTIONS, PREMIUM_GATED_GENDER_PREFS } from "@/constants";
import { cn } from "@/lib/utils";
import { CornerBrackets } from "@/components/blueprint/corner-brackets";
import type { GenderPref } from "@/types";

const ORDER: GenderPref[] = ["random", "male", "female"];
const OPTIONS = ORDER.map(
	(value) => GENDER_PREF_OPTIONS.find((o) => o.value === value)!,
);

interface ChatWithFilterProps {
	value: GenderPref;
	isPremium: boolean;
	onChange: (value: GenderPref) => void;
	onLockedSelect: () => void;
}

/** "Chat with" gender-preference pill filter, shown top-right during a call. */
export function ChatWithFilter({
	value,
	isPremium,
	onChange,
	onLockedSelect,
}: ChatWithFilterProps) {
	return (
		<div className="absolute right-3.5 top-3.5 z-20 flex h-8 items-center gap-1.5 border border-white/10 bg-black/50 py-0 pl-3 pr-1.5 backdrop-blur-md">
			<CornerBrackets size={6} color="var(--color-accent-400)" />
			<span className="mr-0.5 font-heading text-[9px] uppercase tracking-[0.08em] text-call-muted">
				Chat with
			</span>
			{OPTIONS.map((option) => {
				const active = option.value === value;
				const locked = !isPremium && PREMIUM_GATED_GENDER_PREFS.includes(option.value);
				return (
					<button
						key={option.value}
						type="button"
						onClick={() => (locked ? onLockedSelect() : onChange(option.value))}
						className={cn(
							"flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
							active
								? "bg-accent text-on-accent"
								: "bg-white/10 text-white/80 hover:bg-white/20",
						)}
					>
						{option.label}
						{locked && <Lock className="h-2.5 w-2.5" strokeWidth={2} />}
					</button>
				);
			})}
		</div>
	);
}
