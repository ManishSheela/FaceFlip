import { API_URL } from "@/constants";
import type { GoogleProfile } from "@/types";

export async function fetchSession(): Promise<GoogleProfile | null> {
	const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
	if (!res.ok) return null;

	const { user } = await res.json();
	return user;
}

export async function logout(): Promise<void> {
	await fetch(`${API_URL}/auth/logout`, {
		method: "POST",
		credentials: "include",
	});
}
