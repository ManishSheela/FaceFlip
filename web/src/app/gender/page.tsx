"use client";

import { useState } from "react";
import Link from "next/link";
import { GENDER_PREF_OPTIONS, ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";
import { CenteredScreen } from "@/components/layout/centered-screen";
import type { GenderPref } from "@/types";

export default function GenderPage() {
	const [genderPref, setGenderPref] = useState<GenderPref>("random");

	return (
		<CenteredScreen maxWidth={420}>
			<BlueprintFrame className="flex flex-col gap-[17px] p-5 shadow-elev-md">
				<div>
					<h2 className="m-0 mb-1">Who do you want to meet?</h2>
					<p className="text-muted m-0 text-sm">
						You can change this anytime in Settings.
					</p>
				</div>

				<RadioGroup
					value={genderPref}
					onValueChange={(v) => setGenderPref(v as GenderPref)}
					className="gap-1.5"
				>
					{GENDER_PREF_OPTIONS.map((option) => (
						<label
							key={option.value}
							className="flex cursor-pointer items-center gap-2 border border-divider px-3.5 py-2.5 text-sm"
						>
							<RadioGroupItem value={option.value} />
							{option.label}
						</label>
					))}
				</RadioGroup>

				<Button asChild variant="primary" blueprint block size="lg">
					<Link href={ROUTES.matching}>Continue</Link>
				</Button>
			</BlueprintFrame>
		</CenteredScreen>
	);
}
