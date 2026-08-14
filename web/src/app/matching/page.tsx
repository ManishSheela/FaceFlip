"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";
import { APP_NAME, MATCH_END_MESSAGES, MATCH_ERROR_MESSAGES, ROUTES } from "@/constants";
import { useSession } from "@/hooks/use-session";
import { useFaceFlip } from "@/hooks/use-faceflip";
import { useMatchFilters } from "@/hooks/use-match-filters";
import { useElapsedTimer } from "@/hooks/use-elapsed-timer";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadarRings } from "@/components/blueprint/radar-rings";
import { MatchFound } from "./_components/match-found";

const MATCH_FOUND_DELAY_MS = 1600;

export default function MatchingPage() {
	const router = useRouter();
	const { isAuthenticated, userGender } = useSession();
	const filters = useMatchFilters();
	const { status, error, endedReason, partner, skip, startSearching, stop } =
		useFaceFlip();
	const elapsed = useElapsedTimer();

	const statusRef = useRef(status);
	statusRef.current = status;
	const filtersRef = useRef(filters);
	filtersRef.current = filters;
	const mountedRef = useRef(false);

	useEffect(() => {
		const id = requestAnimationFrame(() => {
			mountedRef.current = true;
		});
		return () => cancelAnimationFrame(id);
	}, []);

	useEffect(() => {
		startSearching(filtersRef.current);
	}, [startSearching]);

	useEffect(() => {
		if (status === "connected") {
			router.push(ROUTES.call);
			return;
		}
		if (status === "matched") {
			const id = setTimeout(() => router.push(ROUTES.call), MATCH_FOUND_DELAY_MS);
			return () => clearTimeout(id);
		}
	}, [status, router]);

	useEffect(() => {
		return () => {
			if (mountedRef.current && statusRef.current === "searching") stop();
		};
	}, [stop]);

	const cancel = () => {
		stop();
		router.push(isAuthenticated ? ROUTES.gender : ROUTES.auth);
	};

	const notice = error
		? MATCH_ERROR_MESSAGES[error]
		: endedReason
			? MATCH_END_MESSAGES[endedReason]
			: null;

	if (status === "matched") {
		return (
			<section className="relative flex flex-1 animate-fade-slide-in flex-col bg-call-surface">
				<MatchFound
					selfGender={userGender}
					partnerGender={partner?.gender ?? null}
					onSkip={() => skip(filtersRef.current)}
				/>
			</section>
		);
	}

	return (
		<section className="relative flex flex-1 animate-fade-slide-in flex-col bg-call-surface">
			<div className="flex items-center justify-between px-8 py-5">
				<span className="font-heading text-base font-black text-white">
					{APP_NAME}
				</span>
				<button
					type="button"
					onClick={cancel}
					aria-label="Cancel"
					className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border border-call-divider bg-transparent text-call-muted"
				>
					<X className="h-4 w-4" strokeWidth={1.5} />
				</button>
			</div>

			<div className="flex flex-1 flex-col items-center justify-center gap-5 px-5 pb-16">
				<RadarRings size={140}>
					<div className="h-[88px] w-[88px] rounded-full bg-call-panel" />
				</RadarRings>

				<div className="flex flex-col items-center gap-2">
					<h3 className="m-0 text-base text-white">
						Looking for your next flip…
					</h3>
					<span className="font-heading text-xs text-call-muted">
						{formatDuration(elapsed)}
					</span>
					{notice ? (
						<div className="mt-1 flex max-w-[380px] items-start gap-2 rounded-md border border-call-divider bg-call-panel/60 px-3.5 py-2.5 text-left">
							<AlertTriangle
								className="mt-0.5 h-4 w-4 flex-none text-accent"
								strokeWidth={1.5}
							/>
							<p className="m-0 text-xs text-white">{notice}</p>
						</div>
					) : (
						<p className="m-0 text-center text-[12.5px] text-call-muted/80">
							Tip: say hi first. Works every time.
						</p>
					)}
				</div>

				<div className="mt-1 flex items-center gap-2.5">
					{error && (
						<Button
							variant="primary"
							onClick={() => startSearching(filtersRef.current)}
						>
							Try again
						</Button>
					)}
					<Button
						onClick={cancel}
						className="rounded-full border-call-divider bg-transparent text-white hover:bg-white/10"
					>
						Cancel
					</Button>
				</div>
			</div>
		</section>
	);
}
