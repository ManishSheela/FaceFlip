import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/context/app-providers";
import { Navbar } from "@/components/layout/navbar";
import { CallBanner } from "@/components/layout/call-banner";
import { getServerSession } from "@/lib/server-session";
import { APP_NAME, THEME_STORAGE_KEY } from "@/constants";

export const metadata: Metadata = {
	title: `${APP_NAME} — Every flip, a new face`,
	description:
		"Spontaneous video calls with real people. No scripts, no profiles — just genuine moments.",
};

const themeScript = `
(function () {
  try {
    var t = localStorage.getItem('${THEME_STORAGE_KEY}');
    document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
  } catch (e) {}
})();
`;

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const initialSession = await getServerSession();

	return (
		<html lang="en" data-theme="dark" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body>
				<AppProviders initialSession={initialSession}>
					<div className="flex min-h-screen flex-col bg-bg text-text">
						<div aria-hidden className="h-1 flex-none bg-accent" />
						<Navbar />
						<CallBanner />
						<main className="flex flex-1 flex-col">{children}</main>
					</div>
				</AppProviders>
			</body>
		</html>
	);
}
