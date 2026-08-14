"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, User } from "lucide-react";
import { AUTH_ERROR_MESSAGES, ROUTES } from "@/constants";
import { useSessionActions } from "@/hooks/use-session";
import { startGoogleLogin } from "@/lib/api-service";
import { Button } from "@/components/ui/button";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";
import { CenteredScreen } from "@/components/layout/centered-screen";
import { GoogleIcon } from "@/components/icons/google-icon";

export default function AuthPage() {
	return (
		<Suspense fallback={null}>
			<Auth />
		</Suspense>
	);
}

function Auth() {
	const router = useRouter();
	const { signOut } = useSessionActions();
	const errorCode = useSearchParams().get("error");
	const error = errorCode
		? (AUTH_ERROR_MESSAGES[errorCode] ?? AUTH_ERROR_MESSAGES.failed)
		: null;

	const continueAsGuest = async () => {
		await signOut();
		router.push(ROUTES.onboarding);
	};

	return (
		<CenteredScreen maxWidth={440} background>
			<BlueprintFrame className="flex flex-col gap-[17px] p-5 shadow-elev-md">
				<div className="flex flex-col gap-1.5 border-b border-divider pb-3.5">
					<h2 className="m-0 mt-1.5">Join the conversation</h2>
					<p className="text-muted m-0 text-sm">
						Sign in to unlock match preferences, friends, and chat history.
					</p>
				</div>

				<div className="flex flex-col gap-2.5">
					<Button
						variant="primary"
						block
						className="h-[52px] justify-start gap-3 px-3.5"
						onClick={startGoogleLogin}
					>
						<GoogleIcon />
						Continue with Google
					</Button>

					{error && <p className="m-0 text-xs text-red">{error}</p>}

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
					<Button asChild variant="ghost" size="sm" className="px-0">
						<Link href={ROUTES.landing}>
							<ChevronLeft className="h-[13px] w-[13px]" strokeWidth={1.5} />
							Back
						</Link>
					</Button>
					<span className="text-muted text-xs">No credit card required</span>
				</div>
			</BlueprintFrame>
		</CenteredScreen>
	);
}
