"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "@/hooks/use-theme";

export function Toaster() {
	const { theme } = useTheme();
	return <SonnerToaster theme={theme} position="bottom-right" richColors />;
}
