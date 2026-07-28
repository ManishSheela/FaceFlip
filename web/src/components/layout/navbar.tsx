"use client";

import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { APP_NAME, ROUTES } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { useFriends } from "@/hooks/use-friends";
import { useMatchPreference } from "@/hooks/use-match-preference";
import { useProfile } from "@/hooks/use-profile";
import { useTheme } from "@/hooks/use-theme";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/blueprint/segmented-control";
import { Tag } from "@/components/blueprint/tag";
import type { GenderPref } from "@/types";

const GENDER_OPTIONS: { label: string; value: GenderPref }[] = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
	{ label: "Random", value: "random" },
];

const CHROMELESS_ROUTES: string[] = [ROUTES.call];

export function Navbar() {
	const router = useRouter();
	const pathname = usePathname();
	const { theme, toggleTheme } = useTheme();
	const { loggedIn } = useAuth();
	const { genderPref, setGenderPref } = useMatchPreference();
	const { profileName } = useProfile();
	const { requests } = useFriends();

	if (CHROMELESS_ROUTES.includes(pathname)) return null;

	const pendingCount = requests.length;

	return (
		<header className="nav sticky top-0 z-30 flex items-center gap-3.5 border-b border-divider bg-bg px-3.5 py-2.5">
			<button
				type="button"
				onClick={() => router.push(ROUTES.landing)}
				className="mr-auto cursor-pointer font-heading text-lg font-semibold"
			>
				{APP_NAME}
			</button>

			<Button
				variant="ghost"
				size="sm"
				className="px-2"
				onClick={() => router.push(ROUTES.friends)}
			>
				Friends
				{pendingCount > 0 && (
					<Tag variant="accent" className="ml-1 px-1.5 py-0.5 text-[11px]">
						{pendingCount}
					</Tag>
				)}
			</Button>

			{loggedIn && (
				<SegmentedControl
					aria-label="Match preference"
					options={GENDER_OPTIONS}
					value={genderPref}
					onValueChange={setGenderPref}
					className="hidden sm:inline-flex"
				/>
			)}

			{loggedIn && (
				<button
					type="button"
					onClick={() => router.push(ROUTES.settings)}
					className="flex cursor-pointer items-center gap-1.5 border border-divider py-1 pl-1 pr-2.5"
				>
					<span className="flex h-7 w-7 items-center justify-center bg-accent-100 font-heading text-[11px] text-accent-800">
						{getInitials(profileName)}
					</span>
					<span className="text-[13px] font-medium">{profileName}</span>
				</button>
			)}

			<Button
				variant="secondary"
				size="icon"
				aria-label="Toggle theme"
				onClick={toggleTheme}
			>
				{theme === "dark" ? (
					<Sun className="h-[15px] w-[15px]" strokeWidth={1.5} />
				) : (
					<Moon className="h-[15px] w-[15px]" strokeWidth={1.5} />
				)}
			</Button>
		</header>
	);
}
