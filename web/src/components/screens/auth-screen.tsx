"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, User } from "lucide-react";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { useGoogleLogin } from "@/hooks/use-google-login";
import { useMatchPreference } from "@/hooks/use-match-preference";
import { useProfile } from "@/hooks/use-profile";
import { loadOnboarding } from "@/lib/onboarding-storage";
import { Button } from "@/components/ui/button";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";
import { CenteredScreen } from "@/components/layout/centered-screen";
import { GoogleIcon } from "@/components/icons/google-icon";
import type { GoogleProfile } from "@/types";

export function AuthScreen() {
	const router = useRouter();
	const {
		setLoggedIn,
		setGoogleProfile,
		setUserGender,
		setAgeConfirmed,
		resetOnboardingStatus,
	} = useAuth();
	const { setGenderPref } = useMatchPreference();
	const { setProfileName, setProfileEmail } = useProfile();

	const handleSuccess = useCallback(
		(profile: GoogleProfile) => {
			setGoogleProfile(profile);
			setProfileName(profile.name);
			setProfileEmail(profile.email);
			setLoggedIn(true);

			// Returning Google account with a saved answer: skip the prompt.
			const saved = loadOnboarding(profile.id);
			if (saved) {
				setUserGender(saved.userGender);
				setAgeConfirmed(saved.ageConfirmed);
				router.push(ROUTES.gender);
			} else {
				resetOnboardingStatus();
				router.push(ROUTES.onboarding);
			}
		},
		[
			setGoogleProfile,
			setProfileName,
			setProfileEmail,
			setLoggedIn,
			setUserGender,
			setAgeConfirmed,
			resetOnboardingStatus,
			router,
		],
	);

	const { signIn, loading, error } = useGoogleLogin({
		onSuccess: handleSuccess,
	});

	const continueAsGuest = () => {
		setLoggedIn(false);
		setGoogleProfile(null);
		setGenderPref("random");
		// Guest sessions aren't persistent — always start from a clean prompt.
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
						disabled={loading}
						className="h-[52px] justify-start gap-3 px-3.5"
						onClick={signIn}
					>
						<GoogleIcon />
						{loading ? "Signing in…" : "Continue with Google"}
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
