import type { ReactNode } from "react";
import { Navbar } from "./navbar";

export function AppShell({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col bg-bg text-text">
			<Navbar />
			<main className="flex flex-1 flex-col">{children}</main>
		</div>
	);
}
