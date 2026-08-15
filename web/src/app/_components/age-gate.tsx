"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { loadAgeConfirmed, saveAgeConfirmed } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import { CornerBrackets } from "@/components/blueprint/corner-brackets";
import { ToggleRow } from "@/components/blueprint/toggle-row";

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
		<div className="w-full max-w-[480px] text-left">
			<div className="relative border border-divider">
				<CornerBrackets />
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
