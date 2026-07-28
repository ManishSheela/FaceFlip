"use client";

import { createContext, useMemo, useState, type ReactNode } from "react";
import type { UserGender } from "@/types";

export interface AuthContextValue {
	loggedIn: boolean;
	setLoggedIn: (value: boolean) => void;
	userGender: UserGender | null;
	setUserGender: (value: UserGender) => void;
	ageConfirmed: boolean;
	setAgeConfirmed: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [loggedIn, setLoggedIn] = useState(false);
	const [userGender, setUserGender] = useState<UserGender | null>(null);
	const [ageConfirmed, setAgeConfirmed] = useState(false);

	const value = useMemo<AuthContextValue>(
		() => ({
			loggedIn,
			setLoggedIn,
			userGender,
			setUserGender,
			ageConfirmed,
			setAgeConfirmed,
		}),
		[loggedIn, userGender, ageConfirmed],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
