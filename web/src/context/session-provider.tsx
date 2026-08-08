"use client";

import {
	createContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { toast } from "sonner";
import { ApiService } from "@/lib/api-service";
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
}

const INITIAL_PROFILE: Profile = {
	displayName: null,
	genderPref: null,
	userGender: null,
};

export interface SessionState {
	user: GoogleProfile | null;
	status: SessionStatus;
	isAuthenticated: boolean;
	profileName: string;
	profileEmail: string;
	genderPref: GenderPref;
	userGender: UserGender | null;
}

export interface SessionActions {
	setProfileName: (name: string) => void;
	setGenderPref: (pref: GenderPref) => void;
	setUserGender: (gender: UserGender) => void;
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

	const userGender = profile.userGender ?? user?.gender ?? null;

	const state = useMemo<SessionState>(
		() => ({
			user,
			status,
			isAuthenticated: user !== null,
			profileName: profile.displayName ?? user?.name ?? "",
			profileEmail: user?.email ?? "",
			genderPref: profile.genderPref ?? user?.genderPref ?? "random",
			userGender,
		}),
		[user, status, profile, userGender],
	);

	const actions = useMemo<SessionActions>(() => {
		const update = (patch: Partial<Profile>) =>
			setProfile((prev) => ({ ...prev, ...patch }));

		const persist = async (patch: {
			gender?: UserGender;
			genderPref?: GenderPref;
		}) => {
			if (!userRef.current) return;
			const saved = await ApiService.updateProfile(patch);
			if (saved) setUser(saved);
			else toast.error("Couldn't save your preference. Please try again.");
		};

		return {
			setProfileName: (displayName) => update({ displayName }),
			setGenderPref: (genderPref) => {
				update({ genderPref });
				void persist({ genderPref });
			},
			setUserGender: (userGender) => {
				update({ userGender });
				void persist({ gender: userGender });
			},
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
