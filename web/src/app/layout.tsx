import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/context/app-providers";
import { AppShell } from "@/components/layout/app-shell";
import { ApiService } from "@/lib/api-service";
import { APP_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} — Every flip, a new face`,
  description:
    "Spontaneous video calls with real people. No scripts, no profiles — just genuine moments.",
};

const themeScript = `
(function () {
  try {
    var t = localStorage.getItem('faceflip-theme');
    document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialSession = await ApiService.getServerSession();

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppProviders initialSession={initialSession}>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
