"use client";

import { useCallback, useState } from "react";
import { GOOGLE_CLIENT_ID } from "@/constants";
import {
	fetchGoogleUserInfo,
	loadGoogleIdentityScript,
} from "@/lib/google-identity";
import type { GoogleProfile } from "@/types";

const SCOPE = "openid email profile";

interface UseGoogleLoginOptions {
	onSuccess: (profile: GoogleProfile) => void;
}

/**
 * Google sign-in with nothing but a public client ID: opens Google's popup,
 * then resolves the account's basic profile. Returns state for a plain
 * button — no hidden iframes, no backend round-trip.
 */
export function useGoogleLogin({ onSuccess }: UseGoogleLoginOptions) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const signIn = useCallback(async () => {
		if (!GOOGLE_CLIENT_ID) {
			setError("Google sign-in isn't configured yet.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await loadGoogleIdentityScript();

			window.google!.accounts.oauth2
				.initTokenClient({
					client_id: GOOGLE_CLIENT_ID,
					scope: SCOPE,
					callback: async (response) => {
						if (!response.access_token) {
							setError("Google sign-in was cancelled.");
							setLoading(false);
							return;
						}
						try {
							onSuccess(await fetchGoogleUserInfo(response.access_token));
						} catch (err) {
							setError((err as Error).message);
						} finally {
							setLoading(false);
						}
					},
					error_callback: () => {
						setError("Google sign-in was cancelled.");
						setLoading(false);
					},
				})
				.requestAccessToken();
		} catch (err) {
			setError((err as Error).message);
			setLoading(false);
		}
	}, [onSuccess]);

	return { signIn, loading, error };
}
