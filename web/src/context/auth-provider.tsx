"use client";

import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { fetchSession } from "@/lib/auth-api";
import { loadOnboarding, saveOnboarding } from "@/lib/onboarding-storage";
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
	authReady: boolean;
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
	const [authReady, setAuthReady] = useState(false);

	const resetOnboardingStatus = useCallback(() => {
		setUserGender(null);
		setAgeConfirmed(false);
	}, []);

	useEffect(() => {
		if (loggedIn && googleProfile && userGender !== null && ageConfirmed) {
			saveOnboarding(googleProfile.id, { userGender, ageConfirmed });
		}
	}, [loggedIn, googleProfile, userGender, ageConfirmed]);

	useEffect(() => {
		let cancelled = false;

		fetchSession().then((profile) => {
			if (cancelled) return;

			if (profile) {
				setGoogleProfile(profile);
				setLoggedIn(true);

				const saved = loadOnboarding(profile.id);
				if (saved) {
					setUserGender(saved.userGender);
					setAgeConfirmed(saved.ageConfirmed);
				}
			}
			setAuthReady(true);
		});

		return () => {
			cancelled = true;
		};
	}, []);

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
			authReady,
			resetOnboardingStatus,
		}),
		[
			loggedIn,
			userGender,
			ageConfirmed,
			googleProfile,
			authReady,
			resetOnboardingStatus,
		],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
