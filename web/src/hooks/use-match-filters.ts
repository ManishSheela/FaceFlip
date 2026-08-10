"use client";

import { useMemo } from "react";
import { GENDER_TO_SOCKET, PREF_TO_SOCKET } from "@/constants";
import { useSession } from "@/hooks/use-session";
import type { MatchFilters } from "@/types";

export function useMatchFilters(): MatchFilters {
	const { userGender, genderPref } = useSession();

	return useMemo(
		() => ({
			gender: userGender ? GENDER_TO_SOCKET[userGender] : "other",
			preferGender: PREF_TO_SOCKET[genderPref],
		}),
		[userGender, genderPref],
	);
}
