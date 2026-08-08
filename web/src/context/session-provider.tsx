"use client";

import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { CAMERA_DEVICES, MICROPHONE_DEVICES } from "@/constants";
import { ApiService } from "@/lib/api-service";
import { loadOnboarding, saveOnboarding } from "@/lib/utils";
import type {
	GenderPref,
	GoogleProfile,
	ServerSession,
	UserGender,
} from "@/types";

type SessionStatus = "loading" | "authenticated" | "guest";

interface Preferences {
	displayName: string | null;
	genderPref: GenderPref | null;
	userGender: UserGender | null;
	ageConfirmed: boolean | null;
	camDevice: string;
	micDevice: string;
	notifyMatches: boolean;
	notifyUpdates: boolean;
}

const INITIAL_PREFERENCES: Preferences = {
	displayName: null,
	genderPref: null,
	userGender: null,
	ageConfirmed: null,
	camDevice: CAMERA_DEVICES[0].value,
	micDevice: MICROPHONE_DEVICES[0].value,
	notifyMatches: true,
	notifyUpdates: false,
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
	camDevice: string;
	micDevice: string;
	notifyMatches: boolean;
	notifyUpdates: boolean;
}

export interface SessionActions {
	setProfileName: (name: string) => void;
	setGenderPref: (pref: GenderPref) => void;
	setUserGender: (gender: UserGender) => void;
	setAgeConfirmed: (confirmed: boolean) => void;
	setCamDevice: (device: string) => void;
	setMicDevice: (device: string) => void;
	toggleNotifyMatches: () => void;
	toggleNotifyUpdates: () => void;
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
	const [preferences, setPreferences] =
		useState<Preferences>(INITIAL_PREFERENCES);

	const userRef = useRef(user);
	userRef.current = user;

	const alreadyResolved = initialSession.resolved;

	useEffect(() => {
		if (alreadyResolved) return;

		let cancelled = false;
		ApiService.fetchSession().then((profile) => {
			if (cancelled) return;
			setUser(profile);
			setStatus(profile ? "authenticated" : "guest");
		});

		return () => {
			cancelled = true;
		};
	}, [alreadyResolved]);

	const userId = user?.id ?? null;

	useEffect(() => {
		if (!userId) return;
		const saved = loadOnboarding(userId);
		if (saved) setPreferences((prev) => ({ ...prev, ...saved }));
	}, [userId]);

	const userGender = preferences.userGender ?? user?.gender ?? null;
	const ageConfirmed = preferences.ageConfirmed ?? user?.ageConfirmed ?? false;

	useEffect(() => {
		if (!userId || userGender === null || !ageConfirmed) return;
		saveOnboarding(userId, { userGender, ageConfirmed });
	}, [userId, userGender, ageConfirmed]);

	const state = useMemo<SessionState>(
		() => ({
			user,
			status,
			isAuthenticated: user !== null,
			profileName: preferences.displayName ?? user?.name ?? "",
			profileEmail: user?.email ?? "",
			genderPref: preferences.genderPref ?? user?.genderPref ?? "random",
			userGender,
			ageConfirmed,
			camDevice: preferences.camDevice,
			micDevice: preferences.micDevice,
			notifyMatches: preferences.notifyMatches,
			notifyUpdates: preferences.notifyUpdates,
		}),
		[user, status, preferences, userGender, ageConfirmed],
	);

	const actions = useMemo<SessionActions>(() => {
		const update = (patch: Partial<Preferences>) =>
			setPreferences((prev) => ({ ...prev, ...patch }));

		return {
			setProfileName: (displayName) => update({ displayName }),
			setGenderPref: (genderPref) => update({ genderPref }),
			setUserGender: (userGender) => update({ userGender }),
			setAgeConfirmed: (ageConfirmed) => update({ ageConfirmed }),
			setCamDevice: (camDevice) => update({ camDevice }),
			setMicDevice: (micDevice) => update({ micDevice }),
			toggleNotifyMatches: () =>
				setPreferences((prev) => ({
					...prev,
					notifyMatches: !prev.notifyMatches,
				})),
			toggleNotifyUpdates: () =>
				setPreferences((prev) => ({
					...prev,
					notifyUpdates: !prev.notifyUpdates,
				})),
			refresh: async () => {
				const profile = await ApiService.fetchSession();
				setUser(profile);
				setStatus(profile ? "authenticated" : "guest");
			},
			signOut: async () => {
				if (userRef.current) await ApiService.logout();
				setUser(null);
				setStatus("guest");
				setPreferences(INITIAL_PREFERENCES);
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
