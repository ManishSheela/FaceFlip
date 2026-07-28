"use client";

import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import {
	DEFAULT_PROFILE,
	INITIAL_FRIENDS,
	INITIAL_REQUESTS,
	RANDOM_FRIEND_NAMES,
} from "@/constants";
import type { CallType, Friend, GenderPref, Theme, UserGender } from "@/types";
import { getInitials } from "@/lib/utils";

const THEME_STORAGE_KEY = "faceflip-theme";

export interface AppContextValue {
	/* Theme */
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;

	/* Auth */
	loggedIn: boolean;
	setLoggedIn: (value: boolean) => void;

	/* Onboarding: collected once at login, for both Google and Guest flows */
	userGender: UserGender | null;
	setUserGender: (value: UserGender) => void;
	ageConfirmed: boolean;
	setAgeConfirmed: (value: boolean) => void;

	/* Match preference */
	genderPref: GenderPref;
	setGenderPref: (pref: GenderPref) => void;

	profileName: string;
	setProfileName: (name: string) => void;
	profileEmail: string;

	camDevice: string;
	setCamDevice: (value: string) => void;
	micDevice: string;
	setMicDevice: (value: string) => void;

	notifyMatches: boolean;
	toggleNotifyMatches: () => void;
	notifyUpdates: boolean;
	toggleNotifyUpdates: () => void;

	friends: Friend[];
	requests: typeof INITIAL_REQUESTS;
	acceptRequest: (id: number) => void;
	declineRequest: (id: number) => void;
	addRandomFriend: () => void;

	/* Active call/chat target */
	activeFriend: Friend | null;
	setActiveFriend: (friend: Friend | null) => void;
	callType: CallType;
	startFriendCall: (friend: Friend, type: CallType) => void;
	startStrangerCall: () => void;
	clearActiveFriend: () => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("light");
	const [loggedIn, setLoggedIn] = useState(false);
	const [userGender, setUserGender] = useState<UserGender | null>(null);
	const [ageConfirmed, setAgeConfirmed] = useState(false);
	const [genderPref, setGenderPref] = useState<GenderPref>("random");

	const [profileName, setProfileName] = useState<string>(DEFAULT_PROFILE.name);
	const profileEmail = DEFAULT_PROFILE.email;

	const [camDevice, setCamDevice] = useState("Built-in camera");
	const [micDevice, setMicDevice] = useState("Built-in microphone");

	const [notifyMatches, setNotifyMatches] = useState(true);
	const [notifyUpdates, setNotifyUpdates] = useState(false);

	const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
	const [requests, setRequests] = useState(INITIAL_REQUESTS);

	const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
	const [callType, setCallType] = useState<CallType>("video");

	/* — Theme: hydrate from storage once, then reflect to <html> + persist — */
	useEffect(() => {
		const stored = window.localStorage.getItem(
			THEME_STORAGE_KEY,
		) as Theme | null;
		if (stored === "dark" || stored === "light") setThemeState(stored);
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		window.localStorage.setItem(THEME_STORAGE_KEY, theme);
	}, [theme]);

	const setTheme = useCallback((next: Theme) => setThemeState(next), []);
	const toggleTheme = useCallback(
		() => setThemeState((t) => (t === "light" ? "dark" : "light")),
		[],
	);

	const toggleNotifyMatches = useCallback(
		() => setNotifyMatches((v) => !v),
		[],
	);
	const toggleNotifyUpdates = useCallback(
		() => setNotifyUpdates((v) => !v),
		[],
	);

	const acceptRequest = useCallback((id: number) => {
		setRequests((prev) => {
			const req = prev.find((r) => r.id === id);
			if (req) setFriends((f) => [...f, { ...req, online: true }]);
			return prev.filter((r) => r.id !== id);
		});
	}, []);

	const declineRequest = useCallback((id: number) => {
		setRequests((prev) => prev.filter((r) => r.id !== id));
	}, []);

	const addRandomFriend = useCallback(() => {
		const name =
			RANDOM_FRIEND_NAMES[
				Math.floor(Math.random() * RANDOM_FRIEND_NAMES.length)
			];
		setFriends((prev) => [
			...prev,
			{ id: Date.now(), name, initials: getInitials(name), online: true },
		]);
	}, []);

	const startFriendCall = useCallback((friend: Friend, type: CallType) => {
		setActiveFriend(friend);
		setCallType(type);
	}, []);

	const startStrangerCall = useCallback(() => {
		setActiveFriend(null);
		setCallType("video");
	}, []);

	const clearActiveFriend = useCallback(() => setActiveFriend(null), []);

	const value = useMemo<AppContextValue>(
		() => ({
			theme,
			setTheme,
			toggleTheme,
			loggedIn,
			setLoggedIn,
			userGender,
			setUserGender,
			ageConfirmed,
			setAgeConfirmed,
			genderPref,
			setGenderPref,
			profileName,
			setProfileName,
			profileEmail,
			camDevice,
			setCamDevice,
			micDevice,
			setMicDevice,
			notifyMatches,
			toggleNotifyMatches,
			notifyUpdates,
			toggleNotifyUpdates,
			friends,
			requests,
			acceptRequest,
			declineRequest,
			addRandomFriend,
			activeFriend,
			setActiveFriend,
			callType,
			startFriendCall,
			startStrangerCall,
			clearActiveFriend,
		}),
		[
			theme,
			setTheme,
			toggleTheme,
			loggedIn,
			userGender,
			ageConfirmed,
			genderPref,
			profileName,
			profileEmail,
			camDevice,
			micDevice,
			notifyMatches,
			toggleNotifyMatches,
			notifyUpdates,
			toggleNotifyUpdates,
			friends,
			requests,
			acceptRequest,
			declineRequest,
			addRandomFriend,
			activeFriend,
			callType,
			startFriendCall,
			startStrangerCall,
			clearActiveFriend,
		],
	);

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
