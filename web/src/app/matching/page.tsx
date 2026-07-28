"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
	GENDER_PREF_LABELS,
	MATCHING_DURATION_SEC,
	ONLINE_COUNT,
	ROUTES,
} from "@/constants";
import { useAppState } from "@/hooks/use-app-state";
import { useElapsedTimer } from "@/hooks/use-elapsed-timer";
import { useTimeout } from "@/hooks/use-timeout";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/blueprint/tag";
import { RadarRings } from "@/components/blueprint/radar-rings";
import { StatItem } from "@/components/blueprint/stat-item";

const TARGET_CORNERS = [
	"top-[-5px] left-[-5px] border-t border-l",
	"top-[-5px] right-[-5px] border-t border-r",
	"bottom-[-5px] left-[-5px] border-b border-l",
	"bottom-[-5px] right-[-5px] border-b border-r",
] as const;

export function MatchingScreen() {
	const router = useRouter();
	const { genderPref, startStrangerCall, loggedIn } = useAppState();
	const elapsed = useElapsedTimer(true);

	useEffect(() => {
		startStrangerCall();
	}, [startStrangerCall]);

	useTimeout(() => router.push(ROUTES.call), MATCHING_DURATION_SEC * 1000);

	const cancel = () => router.push(loggedIn ? ROUTES.gender : ROUTES.auth);

	return (
		<section className="relative flex flex-1 animate-fade-slide-in flex-col items-center justify-center overflow-hidden p-5">
			<div className="grid-overlay pointer-events-none absolute inset-0" />

			<div className="relative z-10 flex flex-col items-center gap-[17px]">
				<Tag variant="outline" className="text-[11px] tracking-[0.1em]">
					SCANNING GLOBAL NETWORK
				</Tag>

				<RadarRings size={200}>
					{/* crosshair ticks */}
					<span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-accent" />
					<span className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-accent" />
					<span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-accent" />
					<span className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-accent" />

					{/* center target */}
					<div className="relative flex h-[72px] w-[72px] items-center justify-center border border-accent bg-bg">
						{TARGET_CORNERS.map((pos) => (
							<span
								key={pos}
								aria-hidden
								className={`absolute h-2 w-2 border-accent ${pos}`}
							/>
						))}
						<Search
							className="h-[26px] w-[26px] text-accent"
							strokeWidth={1.5}
						/>
					</div>
				</RadarRings>

				<div className="flex flex-col items-center gap-1.5">
					<h3 className="m-0 text-xl">Finding your match</h3>
					<div className="mt-1 flex flex-col items-center gap-0.5">
						<span className="font-heading text-[26px] tracking-[0.06em] text-accent">
							{formatDuration(elapsed)}
						</span>
						<span className="text-muted text-[10px] uppercase tracking-[0.08em]">
							Elapsed
						</span>
					</div>
				</div>

				<div className="flex items-stretch gap-8 border border-divider px-8 py-3.5">
					<StatItem value={ONLINE_COUNT} label="Online" />
					<div className="w-px bg-divider" />
					<StatItem value={GENDER_PREF_LABELS[genderPref]} label="Preference" />
					<div className="w-px bg-divider" />
					<StatItem value="Global" label="Region" />
				</div>

				<Button variant="ghost" className="mt-1.5" onClick={cancel}>
					Cancel search
				</Button>
			</div>
		</section>
	);
}
