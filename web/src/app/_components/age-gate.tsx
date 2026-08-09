"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { ToggleRow } from "@/components/blueprint/toggle-row";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";

export function AgeGate() {
	const [ageConfirmed, setAgeConfirmed] = useState(false);

	return (
		<div className="flex w-full max-w-[440px] flex-col gap-3.5">
			<BlueprintFrame className="p-3.5 text-left">
				<ToggleRow
					title="I confirm that I am 18 years of age or older"
					description="You must be an adult to use FaceFliip."
					checked={ageConfirmed}
					onCheckedChange={setAgeConfirmed}
				/>
			</BlueprintFrame>

			<Button
				asChild
				variant="primary"
				blueprint
				block
				className="h-auto px-10 py-3.5 text-base"
				disabled={!ageConfirmed}
			>
				<Link href={ROUTES.auth}>Start Chatting</Link>
			</Button>
		</div>
	);
}
