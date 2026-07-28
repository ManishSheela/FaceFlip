"use client";

import { useContext } from "react";
import {
	FriendsContext,
	type FriendsContextValue,
} from "@/context/friends-provider";

export function useFriends(): FriendsContextValue {
	const ctx = useContext(FriendsContext);
	if (!ctx) {
		throw new Error("useFriends must be used within a <FriendsProvider>");
	}
	return ctx;
}
