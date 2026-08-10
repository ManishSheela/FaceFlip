"use client";

import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { THEME_STORAGE_KEY } from "@/constants";
import type { Theme } from "@/types";

export interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("light");

	useEffect(() => {
		let stored: string | null = null;
		try {
			stored = window.localStorage.getItem(THEME_STORAGE_KEY);
		} catch {
			stored = null;
		}
		if (stored === "dark" || stored === "light") setThemeState(stored);
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		try {
			window.localStorage.setItem(THEME_STORAGE_KEY, theme);
		} catch {
			return;
		}
	}, [theme]);

	const setTheme = useCallback((next: Theme) => setThemeState(next), []);
	const toggleTheme = useCallback(
		() => setThemeState((t) => (t === "light" ? "dark" : "light")),
		[],
	);

	const value = useMemo<ThemeContextValue>(
		() => ({ theme, setTheme, toggleTheme }),
		[theme, setTheme, toggleTheme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}
