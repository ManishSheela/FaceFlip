"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { useSession } from "@/hooks/use-session";
import { CenteredScreen } from "@/components/layout/centered-screen";

export default function AuthCallbackPage() {
	const router = useRouter();
	const { status, user, userGender, ageConfirmed } = useSession();

	useEffect(() => {
		if (status === "loading") return;

		if (!user) {
			router.replace(`${ROUTES.auth}?error=failed`);
			return;
		}

		router.replace(
			userGender && ageConfirmed ? ROUTES.gender : ROUTES.onboarding,
		);
	}, [status, user, userGender, ageConfirmed, router]);

	return (
		<CenteredScreen>
			<p className="text-muted m-0 text-center text-sm">Signing you in…</p>
		</CenteredScreen>
	);
}
