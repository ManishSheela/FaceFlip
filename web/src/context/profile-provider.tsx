"use client";

import {
	createContext,
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { DEFAULT_PROFILE } from "@/constants";

export interface ProfileContextValue {
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
}

export const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
	const [profileName, setProfileName] = useState<string>(DEFAULT_PROFILE.name);
	const profileEmail = DEFAULT_PROFILE.email;

	const [camDevice, setCamDevice] = useState("Built-in camera");
	const [micDevice, setMicDevice] = useState("Built-in microphone");

	const [notifyMatches, setNotifyMatches] = useState(true);
	const [notifyUpdates, setNotifyUpdates] = useState(false);

	const toggleNotifyMatches = useCallback(
		() => setNotifyMatches((v) => !v),
		[],
	);
	const toggleNotifyUpdates = useCallback(
		() => setNotifyUpdates((v) => !v),
		[],
	);

	const value = useMemo<ProfileContextValue>(
		() => ({
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
		}),
		[
			profileName,
			profileEmail,
			camDevice,
			micDevice,
			notifyMatches,
			toggleNotifyMatches,
			notifyUpdates,
			toggleNotifyUpdates,
		],
	);

	return (
		<ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
	);
}
