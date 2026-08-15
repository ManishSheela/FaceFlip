"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn, loadAgeConfirmed, saveAgeConfirmed } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import { ToggleRow } from "@/components/blueprint/toggle-row";

const CORNER_MARK =
	"absolute font-mono text-sm leading-none text-divider select-none pointer-events-none";

export function AgeGate() {
	const router = useRouter();
	const { isAuthenticated } = useSession();
	const [ageConfirmed, setAgeConfirmed] = useState(false);

	useEffect(() => {
		setAgeConfirmed(loadAgeConfirmed());
	}, []);

	const confirm = (checked: boolean) => {
		setAgeConfirmed(checked);
		saveAgeConfirmed(checked);
	};

	return (
		<div className="relative w-full max-w-[480px] text-left">
			<span className={cn(CORNER_MARK, "-left-2 -top-2")}>+</span>
			<span className={cn(CORNER_MARK, "-right-2 -top-2")}>+</span>
			<span className={cn(CORNER_MARK, "-bottom-2 -left-2")}>+</span>
			<span className={cn(CORNER_MARK, "-bottom-2 -right-2")}>+</span>

			<div className="overflow-hidden rounded-md border border-divider">
				<div className="bg-surface p-4">
					<ToggleRow
						title="I'm 18 or older"
						description="You must be an adult to use FaceFliip."
						checked={ageConfirmed}
						onCheckedChange={confirm}
					/>
				</div>

				<button
					type="button"
					disabled={!ageConfirmed}
					onClick={() =>
						router.push(isAuthenticated ? ROUTES.call : ROUTES.auth)
					}
					className="flex w-full cursor-pointer items-center justify-center gap-2.5 border-none bg-accent px-4 py-4 font-heading text-base font-bold text-on-accent shadow-elev-cta transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-45"
				>
					Flip into something real
					<ArrowRight className="h-4 w-4" strokeWidth={2.2} />
				</button>
			</div>
		</div>
	);
}
