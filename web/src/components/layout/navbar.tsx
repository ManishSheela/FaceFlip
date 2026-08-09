"use client";

import Link from "next/link";
import { Moon } from "lucide-react";
import { APP_NAME, GENDER_PREF_OPTIONS, ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/blueprint/segmented-control";

export function Navbar() {
	return (
		<header className="nav sticky top-0 z-30 flex items-center gap-3.5 border-b border-divider bg-bg px-3.5 py-2.5">
			<Link
				href={ROUTES.landing}
				className="mr-auto cursor-pointer font-heading text-lg font-semibold"
			>
				{APP_NAME}
			</Link>

			<Button asChild variant="ghost" size="sm" className="px-2">
				<Link href={ROUTES.friends}>Friends</Link>
			</Button>

			<SegmentedControl
				aria-label="Match preference"
				options={GENDER_PREF_OPTIONS}
				value="random"
				onValueChange={() => {}}
				className="hidden sm:inline-flex"
			/>

			<Link
				href={ROUTES.settings}
				className="flex cursor-pointer items-center gap-1.5 border border-divider py-1 pl-1 pr-2.5"
			>
				<span className="flex h-7 w-7 items-center justify-center bg-accent-100 font-heading text-[11px] text-accent-800">
					GU
				</span>
				<span className="text-[13px] font-medium">Guest</span>
			</Link>

			<Button variant="secondary" size="icon" aria-label="Toggle theme">
				<Moon className="h-[15px] w-[15px]" strokeWidth={1.5} />
			</Button>
		</header>
	);
}
