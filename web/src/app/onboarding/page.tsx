"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Lock, Mars, Shuffle, Venus } from "lucide-react";
import {
	GENDER_PREF_OPTIONS,
	ROUTES,
	USER_GENDER_OPTIONS,
	VIDEO_QUALITY_OPTIONS,
} from "@/constants";
import type { VideoQuality } from "@/constants";
import { useSession, useSessionActions } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";
import { CenteredScreen } from "@/components/layout/centered-screen";
import type { UserGender } from "@/types";

const GENDER_ICON: Record<UserGender, typeof Mars> = {
	male: Mars,
	female: Venus,
	random: Shuffle,
};

export default function OnboardingPage() {
	const router = useRouter();
	const { isAuthenticated, userGender } = useSession();
	const { setUserGender } = useSessionActions();
	const [selectedGender, setSelectedGender] = useState<UserGender | null>(
		userGender,
	);
	const [videoQuality, setVideoQuality] = useState<VideoQuality>("standard");

	const handleContinue = () => {
		if (!selectedGender) return;
		setUserGender(selectedGender);
		router.push(isAuthenticated ? ROUTES.gender : ROUTES.call);
	};

	return (
		<CenteredScreen maxWidth={560} background>
			<BlueprintFrame className="flex flex-col gap-[22px] p-5 shadow-elev-md sm:p-7">
				<div className="flex items-center justify-between">
					<h2 className="m-0">Quick setup</h2>
					<span className="font-heading text-xs text-muted">
						Step 2 of {isAuthenticated ? 3 : 2}
					</span>
				</div>

				{!isAuthenticated && (
					<div className="relative">
						<div className="mb-2.5 text-[13px] font-bold">Match with</div>
						<div className="flex flex-wrap gap-2 opacity-45">
							{GENDER_PREF_OPTIONS.map((option) => (
								<span
									key={option.value}
									className="cursor-not-allowed rounded-pill border border-divider bg-surface px-4 py-2 text-[13px] font-semibold"
								>
									{option.label}
								</span>
							))}
						</div>
						<div className="absolute right-0 top-0 flex items-center gap-1.5 rounded-pill border border-amber bg-amber-tint px-3 py-1.5">
							<Lock className="h-3 w-3 text-amber" strokeWidth={2.5} />
							<span className="text-[11px] font-bold text-amber">
								Premium only
							</span>
						</div>
						<div className="mt-2.5 flex items-center justify-between gap-3 rounded-md bg-amber-tint px-3.5 py-3">
							<p className="m-0 text-xs">Guests always match with everyone.</p>
							<Button
								size="sm"
								className="flex-none border-amber bg-amber text-white hover:opacity-90"
							>
								Unlock with Premium
							</Button>
						</div>
					</div>
				)}

				<div>
					<div className="mb-2.5 text-[13px] font-bold">I am</div>
					<div className="flex gap-2">
						{USER_GENDER_OPTIONS.map((option) => {
							const Icon = GENDER_ICON[option.value];
							const active = option.value === selectedGender;
							return (
								<button
									key={option.value}
									type="button"
									onClick={() => setSelectedGender(option.value)}
									className={cn(
										"flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border px-3.5 py-2.5 text-[13px] font-semibold transition-colors",
										active
											? "border-accent bg-accent-100 text-accent-800"
											: "border-divider bg-surface text-text hover:border-[color-mix(in_srgb,var(--color-text)_35%,transparent)]",
									)}
								>
									<Icon className="h-[13px] w-[13px]" strokeWidth={2.2} />
									{option.label}
								</button>
							);
						})}
					</div>
				</div>

				<div>
					<div className="mb-2.5 text-[13px] font-bold">Video quality</div>
					<div className="flex gap-2">
						{VIDEO_QUALITY_OPTIONS.map((option) => {
							const active = option.value === videoQuality;
							const disabled = option.locked && !isAuthenticated;
							return (
								<div key={option.value} className="flex-1">
									<button
										type="button"
										disabled={disabled}
										onClick={() => setVideoQuality(option.value)}
										className={cn(
											"relative flex w-full cursor-pointer items-center justify-center rounded-md border px-3.5 py-2.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
											active
												? "border-accent bg-accent-100 text-accent-800"
												: "border-divider bg-surface text-text",
										)}
									>
										{option.label}
										{option.locked && (
											<span className="absolute -right-1.5 -top-2 rounded-md bg-amber px-1.5 py-0.5 text-[9px] font-bold text-white">
												PRO
											</span>
										)}
									</button>
									<div className="mt-1 text-center text-[11px] text-muted">
										{option.sub}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className="flex items-center justify-between border-t border-divider pt-3.5">
					<Button asChild variant="ghost" size="sm" className="px-0">
						<Link href={ROUTES.auth}>
							<ChevronLeft className="h-[13px] w-[13px]" strokeWidth={1.5} />
							Back
						</Link>
					</Button>

					<Button
						variant="primary"
						size="lg"
						disabled={!selectedGender}
						onClick={handleContinue}
						className="gap-1.5"
					>
						Continue
						<ChevronRight className="h-4 w-4" strokeWidth={2.2} />
					</Button>
				</div>
			</BlueprintFrame>
		</CenteredScreen>
	);
}
