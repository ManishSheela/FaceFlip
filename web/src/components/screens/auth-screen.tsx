"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, User } from "lucide-react";
import { API_URL, ROUTES } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { useMatchPreference } from "@/hooks/use-match-preference";
import { Button } from "@/components/ui/button";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";
import { CenteredScreen } from "@/components/layout/centered-screen";
import { GoogleIcon } from "@/components/icons/google-icon";

const ERROR_MESSAGES: Record<string, string> = {
	cancelled: "Google sign-in was cancelled.",
	failed: "Couldn't complete Google sign-in. Please try again.",
};

export function AuthScreen() {
	const router = useRouter();
	const { setLoggedIn, setGoogleProfile, resetOnboardingStatus } = useAuth();
	const { setGenderPref } = useMatchPreference();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const code = new URLSearchParams(window.location.search).get("error");
		if (code) setError(ERROR_MESSAGES[code] ?? ERROR_MESSAGES.failed);
	}, []);

	const continueAsGuest = () => {
		setLoggedIn(false);
		setGoogleProfile(null);
		setGenderPref("random");
		resetOnboardingStatus();
		router.push(ROUTES.onboarding);
	};

	return (
		<CenteredScreen maxWidth={440}>
			<BlueprintFrame className="flex flex-col gap-[17px] p-5 shadow-elev-md">
				<div className="flex flex-col gap-1.5 border-b border-divider pb-3.5">
					<h2 className="m-0 mt-1.5 text-[26px]">Join the conversation</h2>
					<p className="text-muted m-0 text-sm">
						Sign in to unlock match preferences, friends, and chat history.
					</p>
				</div>

				<div className="flex flex-col gap-2.5">
					<Button
						variant="primary"
						blueprint
						block
						className="h-[52px] justify-start gap-3 px-3.5"
						onClick={() => {
							window.location.href = `${API_URL}/auth/google`;
						}}
					>
						<GoogleIcon />
						Continue with Google
					</Button>

					{error && <p className="m-0 text-xs text-[#c0392b]">{error}</p>}

					<div className="flex items-center gap-2.5">
						<div className="h-px flex-1 bg-divider" />
						<span className="text-muted text-xs uppercase tracking-[0.06em]">
							or
						</span>
						<div className="h-px flex-1 bg-divider" />
					</div>

					<Button
						variant="secondary"
						block
						className="h-[52px] justify-start gap-3 px-3.5"
						onClick={continueAsGuest}
					>
						<User className="h-[18px] w-[18px]" strokeWidth={1.5} />
						Continue as Guest
					</Button>
				</div>

				<div className="flex items-center justify-between border-t border-divider pt-1.5">
					<Button
						variant="ghost"
						size="sm"
						className="px-0"
						onClick={() => router.push(ROUTES.landing)}
					>
						<ChevronLeft className="h-[13px] w-[13px]" strokeWidth={1.5} />
						Back
					</Button>
					<span className="text-muted text-xs">No credit card required</span>
				</div>
			</BlueprintFrame>
		</CenteredScreen>
	);
}
