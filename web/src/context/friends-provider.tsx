"use client";

import {
	createContext,
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import {
	INITIAL_FRIENDS,
	INITIAL_REQUESTS,
	RANDOM_FRIEND_NAMES,
} from "@/constants";
import type { Friend } from "@/types";
import { getInitials } from "@/lib/utils";

export interface FriendsContextValue {
	friends: Friend[];
	requests: typeof INITIAL_REQUESTS;
	acceptRequest: (id: number) => void;
	declineRequest: (id: number) => void;
	addRandomFriend: () => void;
}

export const FriendsContext = createContext<FriendsContextValue | null>(null);

export function FriendsProvider({ children }: { children: ReactNode }) {
	const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
	const [requests, setRequests] = useState(INITIAL_REQUESTS);

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

	const value = useMemo<FriendsContextValue>(
		() => ({ friends, requests, acceptRequest, declineRequest, addRandomFriend }),
		[friends, requests, acceptRequest, declineRequest, addRandomFriend],
	);

	return (
		<FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
	);
}
