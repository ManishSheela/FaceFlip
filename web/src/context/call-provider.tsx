"use client";

import {
	createContext,
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import type { CallType, Friend } from "@/types";

export interface CallContextValue {
	activeFriend: Friend | null;
	setActiveFriend: (friend: Friend | null) => void;
	callType: CallType;
	startFriendCall: (friend: Friend, type: CallType) => void;
	startStrangerCall: () => void;
}

export const CallContext = createContext<CallContextValue | null>(null);

export function CallProvider({ children }: { children: ReactNode }) {
	const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
	const [callType, setCallType] = useState<CallType>("video");

	const startFriendCall = useCallback((friend: Friend, type: CallType) => {
		setActiveFriend(friend);
		setCallType(type);
	}, []);

	const startStrangerCall = useCallback(() => {
		setActiveFriend(null);
		setCallType("video");
	}, []);

	const value = useMemo<CallContextValue>(
		() => ({
			activeFriend,
			setActiveFriend,
			callType,
			startFriendCall,
			startStrangerCall,
		}),
		[activeFriend, callType, startFriendCall, startStrangerCall],
	);

	return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}
