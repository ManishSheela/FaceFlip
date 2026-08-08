"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { CenteredScreen } from "@/components/layout/centered-screen";

export default function AuthCallbackPage() {
	const router = useRouter();
	const { authReady, googleProfile, userGender, ageConfirmed } = useAuth();
	const { setProfileName, setProfileEmail } = useProfile();

	useEffect(() => {
		if (!authReady) return;

		if (!googleProfile) {
			router.replace(`${ROUTES.auth}?error=failed`);
			return;
		}

		setProfileName(googleProfile.name);
		setProfileEmail(googleProfile.email);
		router.replace(
			userGender && ageConfirmed ? ROUTES.gender : ROUTES.onboarding,
		);
	}, [
		authReady,
		googleProfile,
		userGender,
		ageConfirmed,
		setProfileName,
		setProfileEmail,
		router,
	]);

	return (
		<CenteredScreen>
			<p className="text-muted m-0 text-center text-sm">Signing you in…</p>
		</CenteredScreen>
	);
}
