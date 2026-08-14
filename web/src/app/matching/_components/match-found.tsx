"use client";

import { GENDER_BADGE_LABELS, GENDER_COLORS } from "@/constants";
import type { SocketGender } from "@/types";

function toSocketGender(gender: string | null | undefined): SocketGender {
	return gender === "male" || gender === "female" ? gender : "other";
}

interface PersonProps {
	label: string;
	gender: SocketGender;
}

function Person({ label, gender }: PersonProps) {
	const color = GENDER_COLORS[gender];
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-3.5">
			<div
				className="h-24 w-24 rounded-full border-2"
				style={{ backgroundColor: `${color}26`, borderColor: color }}
			/>
			<div className="flex flex-col items-center gap-1.5">
				<span className="font-heading text-[10px] tracking-[0.08em] text-call-muted">
					{label}
				</span>
				<span
					className="rounded-pill bg-call-panel px-3.5 py-1.5 text-xs font-semibold"
					style={{ color }}
				>
					{GENDER_BADGE_LABELS[gender]}
				</span>
			</div>
		</div>
	);
}

interface MatchFoundProps {
	selfGender: string | null;
	partnerGender: SocketGender | null;
	onSkip: () => void;
}

/** Transitional screen shown briefly once a partner is found, before auto-connecting. */
export function MatchFound({ selfGender, partnerGender, onSkip }: MatchFoundProps) {
	return (
		<div className="relative flex flex-1">
			<Person label="You" gender={toSocketGender(selfGender)} />

			<div className="pointer-events-none absolute left-1/2 top-1/2 z-[2] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
				<span className="h-3.5 w-3.5 rounded-full bg-green shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-green)_20%,transparent)]" />
				<span className="font-heading text-[13px] font-black text-white">
					Found!
				</span>
			</div>

			<div className="w-px bg-call-divider" />

			<Person label="Them" gender={toSocketGender(partnerGender)} />

			<div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/45 px-8 py-4 backdrop-blur-[8px]">
				<span className="font-heading text-xs text-call-muted">
					connecting…
				</span>
				<button
					type="button"
					onClick={onSkip}
					className="cursor-pointer rounded-full border border-call-divider bg-transparent px-4 py-2 text-xs font-semibold text-call-muted"
				>
					Not feeling it →
				</button>
			</div>
		</div>
	);
}
