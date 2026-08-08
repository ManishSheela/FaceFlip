"use client";

import { useContext } from "react";
import {
	SessionActionsContext,
	SessionStateContext,
	type SessionActions,
	type SessionState,
} from "@/context/session-provider";

export function useSession(): SessionState {
	const ctx = useContext(SessionStateContext);
	if (!ctx) {
		throw new Error("useSession must be used within a <SessionProvider>");
	}
	return ctx;
}

export function useSessionActions(): SessionActions {
	const ctx = useContext(SessionActionsContext);
	if (!ctx) {
		throw new Error(
			"useSessionActions must be used within a <SessionProvider>",
		);
	}
	return ctx;
}
