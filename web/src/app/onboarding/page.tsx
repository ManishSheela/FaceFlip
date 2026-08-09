"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ROUTES, USER_GENDER_OPTIONS } from "@/constants";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";
import { CenteredScreen } from "@/components/layout/centered-screen";
import type { UserGender } from "@/types";

export default function OnboardingPage() {
	const [selectedGender, setSelectedGender] = useState<UserGender | null>(
		null,
	);

	return (
		<CenteredScreen maxWidth={440}>
			<BlueprintFrame className="flex flex-col gap-[17px] p-5 shadow-elev-md">
				<div className="flex flex-col gap-1.5 border-b border-divider pb-3.5">
					<h2 className="m-0 mt-1.5 text-[26px]">Just a couple things</h2>
					<p className="text-muted m-0 text-sm">
						Required before you can start matching.
					</p>
				</div>

				<div className="flex flex-col gap-1.5">
					<span className="text-sm font-medium">Your gender</span>
					<RadioGroup
						aria-label="Your gender"
						value={selectedGender ?? undefined}
						onValueChange={(v) => setSelectedGender(v as UserGender)}
						className="gap-1.5"
					>
						{USER_GENDER_OPTIONS.map((option) => (
							<label
								key={option.value}
								className="flex cursor-pointer items-center gap-2 border border-divider px-3.5 py-2.5 text-sm"
							>
								<RadioGroupItem value={option.value} />
								{option.label}
							</label>
						))}
					</RadioGroup>
				</div>

				<Button
					asChild
					variant="primary"
					blueprint
					block
					size="lg"
					disabled={!selectedGender}
				>
					<Link href={ROUTES.matching}>Continue</Link>
				</Button>

				<div className="flex items-center border-t border-divider pt-1.5">
					<Button asChild variant="ghost" size="sm" className="px-0">
						<Link href={ROUTES.auth}>
							<ChevronLeft className="h-[13px] w-[13px]" strokeWidth={1.5} />
							Back
						</Link>
					</Button>
				</div>
			</BlueprintFrame>
		</CenteredScreen>
	);
}
