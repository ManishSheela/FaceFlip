"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/context/theme-provider";
import { AuthProvider } from "@/context/auth-provider";
import { MatchPreferenceProvider } from "@/context/match-preference-provider";
import { ProfileProvider } from "@/context/profile-provider";
import { FriendsProvider } from "@/context/friends-provider";
import { CallProvider } from "@/context/call-provider";

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<AuthProvider>
				<MatchPreferenceProvider>
					<ProfileProvider>
						<FriendsProvider>
							<CallProvider>{children}</CallProvider>
						</FriendsProvider>
					</ProfileProvider>
				</MatchPreferenceProvider>
			</AuthProvider>
		</ThemeProvider>
	);
}
