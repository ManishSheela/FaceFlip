"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { loadAgeConfirmed, saveAgeConfirmed } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { ToggleRow } from "@/components/blueprint/toggle-row";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";

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
		<div className="flex w-full max-w-[440px] flex-col gap-3.5">
			<BlueprintFrame className="p-3.5 text-left">
				<ToggleRow
					title="I confirm that I am 18 years of age or older"
					description="You must be an adult to use FaceFliip."
					checked={ageConfirmed}
					onCheckedChange={confirm}
				/>
			</BlueprintFrame>

			<Button
				variant="primary"
				blueprint
				block
				className="h-auto px-10 py-3.5 text-base"
				disabled={!ageConfirmed}
				onClick={() =>
					router.push(isAuthenticated ? ROUTES.matching : ROUTES.auth)
				}
			>
				Start Chatting
			</Button>
		</div>
	);
}
