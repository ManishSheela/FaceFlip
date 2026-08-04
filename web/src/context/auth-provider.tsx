"use client";

import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { saveOnboarding } from "@/lib/onboarding-storage";
import type { GoogleProfile, UserGender } from "@/types";

export interface AuthContextValue {
	loggedIn: boolean;
	setLoggedIn: (value: boolean) => void;
	userGender: UserGender | null;
	setUserGender: (value: UserGender) => void;
	ageConfirmed: boolean;
	setAgeConfirmed: (value: boolean) => void;
	googleProfile: GoogleProfile | null;
	setGoogleProfile: (value: GoogleProfile | null) => void;
	/** Clears the gender/age answers, e.g. before a fresh onboarding prompt. */
	resetOnboardingStatus: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [loggedIn, setLoggedIn] = useState(false);
	const [userGender, setUserGender] = useState<UserGender | null>(null);
	const [ageConfirmed, setAgeConfirmed] = useState(false);
	const [googleProfile, setGoogleProfile] = useState<GoogleProfile | null>(
		null,
	);

	const resetOnboardingStatus = useCallback(() => {
		setUserGender(null);
		setAgeConfirmed(false);
	}, []);

	/* Google accounts: keep the saved gender/age answer in sync with the
	   account, so a later sign-in on this device can skip the prompt. */
	useEffect(() => {
		if (loggedIn && googleProfile && userGender !== null && ageConfirmed) {
			saveOnboarding(googleProfile.id, { userGender, ageConfirmed });
		}
	}, [loggedIn, googleProfile, userGender, ageConfirmed]);

	const value = useMemo<AuthContextValue>(
		() => ({
			loggedIn,
			setLoggedIn,
			userGender,
			setUserGender,
			ageConfirmed,
			setAgeConfirmed,
			googleProfile,
			setGoogleProfile,
			resetOnboardingStatus,
		}),
		[loggedIn, userGender, ageConfirmed, googleProfile, resetOnboardingStatus],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
