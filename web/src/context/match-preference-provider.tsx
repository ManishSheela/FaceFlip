"use client";

import { createContext, useMemo, useState, type ReactNode } from "react";
import type { GenderPref } from "@/types";

export interface MatchPreferenceContextValue {
	genderPref: GenderPref;
	setGenderPref: (pref: GenderPref) => void;
}

export const MatchPreferenceContext =
	createContext<MatchPreferenceContextValue | null>(null);

export function MatchPreferenceProvider({ children }: { children: ReactNode }) {
	const [genderPref, setGenderPref] = useState<GenderPref>("random");

	const value = useMemo<MatchPreferenceContextValue>(
		() => ({ genderPref, setGenderPref }),
		[genderPref],
	);

	return (
		<MatchPreferenceContext.Provider value={value}>
			{children}
		</MatchPreferenceContext.Provider>
	);
}
