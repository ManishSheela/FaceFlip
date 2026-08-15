"use client";

import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { APP_NAME, CHROMELESS_ROUTES, ROUTES } from "@/constants";
import { useSession, useSessionActions } from "@/hooks/use-session";
import { useTheme } from "@/hooks/use-theme";
import { getInitials } from "@/lib/utils";
import { LogoMark } from "@/components/icons/logo-mark";

const NAV_ICON_BUTTON =
	"relative flex h-[34px] w-[34px] flex-none cursor-pointer items-center justify-center rounded-[9px] border border-divider bg-surface transition-colors hover:bg-neutral-100";

export function Navbar() {
	const router = useRouter();
	const pathname = usePathname();
	const { theme, toggleTheme } = useTheme();
	const { isAuthenticated, profileName } = useSession();
	const { signOut } = useSessionActions();

	if (CHROMELESS_ROUTES.includes(pathname)) return null;

	return (
		<header className="sticky top-0 z-30 flex h-14 flex-none items-center justify-between gap-2 bg-surface px-4 shadow-[0_1px_0_var(--color-divider),0_4px_20px_color-mix(in_srgb,var(--color-accent)_6%,transparent)] sm:px-8">
			<button
				type="button"
				onClick={() => router.push(ROUTES.landing)}
				className="flex flex-none cursor-pointer items-center gap-3"
			>
				<span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-white shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_20%,transparent)]">
					<LogoMark />
				</span>
				<span className="flex flex-col items-start leading-none">
					<span className="font-heading text-[17px] font-black leading-none tracking-[-0.02em]">
						{APP_NAME}
					</span>
					<span className="font-heading text-[9px] uppercase leading-none tracking-[0.1em] text-accent">
						Video chat
					</span>
				</span>
			</button>

			<div className="flex flex-none items-center gap-2">
				<button
					type="button"
					aria-label="Toggle theme"
					onClick={toggleTheme}
					className={NAV_ICON_BUTTON}
				>
					{theme === "dark" ? (
						<Sun className="h-[15px] w-[15px]" strokeWidth={1.5} />
					) : (
						<Moon className="h-[15px] w-[15px]" strokeWidth={1.5} />
					)}
				</button>

				{isAuthenticated && (
					<>
						<button
							type="button"
							onClick={() => router.push(ROUTES.settings)}
							className="flex flex-none cursor-pointer items-center gap-2 overflow-hidden rounded-3xl border border-divider bg-surface py-[5px] pl-[6px] pr-[6px] sm:pr-3"
						>
							<span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-gradient-to-br from-accent to-[oklch(0.45_0.1_270)] font-heading text-[11px] font-black text-white">
								{getInitials(profileName)}
							</span>
							<span className="hidden text-xs font-semibold sm:inline">
								{profileName}
							</span>
						</button>

						<button
							type="button"
							onClick={() => void signOut()}
							className="hidden flex-none cursor-pointer rounded-[9px] border px-[13px] py-[7px] text-[11px] font-semibold sm:block"
							style={{
								borderColor: "oklch(0.65 0.1 25 / 0.3)",
								background: "oklch(0.65 0.1 25 / 0.06)",
								color: "oklch(0.48 0.1 25)",
							}}
						>
							Log out
						</button>
					</>
				)}
			</div>
		</header>
	);
}
