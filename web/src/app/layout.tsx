import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { APP_NAME } from "@/constants";

export const metadata: Metadata = {
	title: `${APP_NAME} — Every flip, a new face`,
	description:
		"Spontaneous video calls with real people. No scripts, no profiles — just genuine moments.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" data-theme="light">
			<body>
				<div className="flex min-h-screen flex-col bg-bg text-text">
					<Navbar />
					<main className="flex flex-1 flex-col">{children}</main>
				</div>
			</body>
		</html>
	);
}
