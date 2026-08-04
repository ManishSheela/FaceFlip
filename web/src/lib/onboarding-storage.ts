import type { UserGender } from "@/types";

const STORAGE_PREFIX = "faceflip-onboarding:";

interface StoredOnboarding {
	userGender: UserGender;
	ageConfirmed: boolean;
}

export function loadOnboarding(googleId: string): StoredOnboarding | null {
	try {
		const raw = window.localStorage.getItem(STORAGE_PREFIX + googleId);
		if (!raw) return null;
		return JSON.parse(raw) as StoredOnboarding;
	} catch {
		return null;
	}
}

export function saveOnboarding(googleId: string, data: StoredOnboarding): void {
	try {
		window.localStorage.setItem(
			STORAGE_PREFIX + googleId,
			JSON.stringify(data),
		);
	} catch {
		/* localStorage unavailable (private mode, quota) — will just re-prompt next time. */
	}
}
