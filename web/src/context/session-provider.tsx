"use client";

import {
	createContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { ApiService } from "@/lib/api-service";
import { loadOnboarding, saveOnboarding } from "@/lib/utils";
import type {
	GenderPref,
	GoogleProfile,
	ServerSession,
	UserGender,
} from "@/types";

type SessionStatus = "loading" | "authenticated" | "guest";

interface Profile {
	displayName: string | null;
	genderPref: GenderPref | null;
	userGender: UserGender | null;
	ageConfirmed: boolean | null;
}

const INITIAL_PROFILE: Profile = {
	displayName: null,
	genderPref: null,
	userGender: null,
	ageConfirmed: null,
};

export interface SessionState {
	user: GoogleProfile | null;
	status: SessionStatus;
	isAuthenticated: boolean;
	profileName: string;
	profileEmail: string;
	genderPref: GenderPref;
	userGender: UserGender | null;
	ageConfirmed: boolean;
}

export interface SessionActions {
	setProfileName: (name: string) => void;
	setGenderPref: (pref: GenderPref) => void;
	setUserGender: (gender: UserGender) => void;
	setAgeConfirmed: (confirmed: boolean) => void;
	refresh: () => Promise<void>;
	signOut: () => Promise<void>;
}

export const SessionStateContext = createContext<SessionState | null>(null);
export const SessionActionsContext = createContext<SessionActions | null>(null);

export function SessionProvider({
	initialSession,
	children,
}: {
	initialSession: ServerSession;
	children: ReactNode;
}) {
	const [user, setUser] = useState<GoogleProfile | null>(initialSession.user);
	const [status, setStatus] = useState<SessionStatus>(() => {
		if (!initialSession.resolved) return "loading";
		return initialSession.user ? "authenticated" : "guest";
	});
	const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);

	const userRef = useRef(user);
	userRef.current = user;

	const alreadyResolved = initialSession.resolved;

	useEffect(() => {
		if (alreadyResolved) return;

		let cancelled = false;
		ApiService.fetchSession().then((fetched) => {
			if (cancelled) return;
			setUser(fetched);
			setStatus(fetched ? "authenticated" : "guest");
		});

		return () => {
			cancelled = true;
		};
	}, [alreadyResolved]);

	const userId = user?.id ?? null;

	useEffect(() => {
		if (!userId) return;
		const saved = loadOnboarding(userId);
		if (saved) setProfile((prev) => ({ ...prev, ...saved }));
	}, [userId]);

	const userGender = profile.userGender ?? user?.gender ?? null;
	const ageConfirmed = profile.ageConfirmed ?? user?.ageConfirmed ?? false;

	useEffect(() => {
		if (!userId || userGender === null || !ageConfirmed) return;
		saveOnboarding(userId, { userGender, ageConfirmed });
	}, [userId, userGender, ageConfirmed]);

	const state = useMemo<SessionState>(
		() => ({
			user,
			status,
			isAuthenticated: user !== null,
			profileName: profile.displayName ?? user?.name ?? "",
			profileEmail: user?.email ?? "",
			genderPref: profile.genderPref ?? user?.genderPref ?? "random",
			userGender,
			ageConfirmed,
		}),
		[user, status, profile, userGender, ageConfirmed],
	);

	const actions = useMemo<SessionActions>(() => {
		const update = (patch: Partial<Profile>) =>
			setProfile((prev) => ({ ...prev, ...patch }));

		return {
			setProfileName: (displayName) => update({ displayName }),
			setGenderPref: (genderPref) => update({ genderPref }),
			setUserGender: (userGender) => update({ userGender }),
			setAgeConfirmed: (ageConfirmed) => update({ ageConfirmed }),
			refresh: async () => {
				const fetched = await ApiService.fetchSession();
				setUser(fetched);
				setStatus(fetched ? "authenticated" : "guest");
			},
			signOut: async () => {
				if (userRef.current) await ApiService.logout();
				setUser(null);
				setStatus("guest");
				setProfile(INITIAL_PROFILE);
			},
		};
	}, []);

	return (
		<SessionStateContext.Provider value={state}>
			<SessionActionsContext.Provider value={actions}>
				{children}
			</SessionActionsContext.Provider>
		</SessionStateContext.Provider>
	);
}
