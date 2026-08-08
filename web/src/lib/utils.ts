import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserGender } from "@/types";

const ONBOARDING_STORAGE_PREFIX = "faceflip-onboarding:";

interface StoredOnboarding {
	userGender: UserGender;
	ageConfirmed: boolean;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function loadOnboarding(googleId: string): StoredOnboarding | null {
	try {
		const raw = window.localStorage.getItem(
			ONBOARDING_STORAGE_PREFIX + googleId,
		);
		if (!raw) return null;
		return JSON.parse(raw) as StoredOnboarding;
	} catch {
		return null;
	}
}

export function saveOnboarding(googleId: string, data: StoredOnboarding): void {
	try {
		window.localStorage.setItem(
			ONBOARDING_STORAGE_PREFIX + googleId,
			JSON.stringify(data),
		);
	} catch {
		/* localStorage unavailable (private mode, quota) — will just re-prompt next time. */
	}
}

export function formatDuration(totalSeconds: number): string {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}
