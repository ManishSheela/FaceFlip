import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/context/app-providers";
import { AppShell } from "@/components/layout/app-shell";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
