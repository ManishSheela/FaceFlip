import type { ReactNode } from "react";
import { ThemeProvider } from "@/context/theme-provider";
import { SessionProvider } from "@/context/session-provider";
import { FriendsProvider } from "@/context/friends-provider";
import { CallProvider } from "@/context/call-provider";
import { Toaster } from "@/components/layout/toaster";
import type { ServerSession } from "@/types";

export function AppProviders({
	initialSession,
	children,
}: {
	initialSession: ServerSession;
	children: ReactNode;
}) {
	return (
		<ThemeProvider>
			<Toaster />
			<SessionProvider initialSession={initialSession}>
				<FriendsProvider>
					<CallProvider>{children}</CallProvider>
				</FriendsProvider>
			</SessionProvider>
		</ThemeProvider>
	);
}
