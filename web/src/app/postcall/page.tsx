"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, UserPlus } from "lucide-react";
import { ROUTES } from "@/constants";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";
import { CenteredScreen } from "@/components/layout/centered-screen";

export default function PostCallPage() {
	return (
		<Suspense fallback={null}>
			<PostCall />
		</Suspense>
	);
}

function PostCall() {
	const seconds = Number(useSearchParams().get("d")) || 0;

	return (
		<CenteredScreen maxWidth={420}>
			<BlueprintFrame className="flex flex-col items-center gap-3.5 p-5 text-center shadow-elev-md">
				<CheckCircle2 className="h-8 w-8 text-accent" strokeWidth={1.5} />
				<h2 className="m-0">Call ended</h2>
				<p className="text-muted m-0">Lasted {formatDuration(seconds)}</p>

				<Button asChild variant="primary" blueprint block size="lg">
					<Link href={ROUTES.matching}>Next stranger</Link>
				</Button>

				<Button variant="secondary" block className="gap-1.5">
					<UserPlus className="h-3.5 w-3.5" strokeWidth={1.5} />
					Add as Friend
				</Button>

				<Button asChild variant="ghost">
					<Link href={ROUTES.landing}>Back to home</Link>
				</Button>
			</BlueprintFrame>
		</CenteredScreen>
	);
}
