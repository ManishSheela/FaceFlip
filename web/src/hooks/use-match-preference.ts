"use client";

import { useContext } from "react";
import {
	MatchPreferenceContext,
	type MatchPreferenceContextValue,
} from "@/context/match-preference-provider";

export function useMatchPreference(): MatchPreferenceContextValue {
	const ctx = useContext(MatchPreferenceContext);
	if (!ctx) {
		throw new Error(
			"useMatchPreference must be used within a <MatchPreferenceProvider>",
		);
	}
	return ctx;
}
