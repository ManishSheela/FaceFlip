import { API_URL } from "@/constants";
import { axios } from "@/lib/axios";
import type { GoogleProfile } from "@/types";

interface SessionResponse {
	user: GoogleProfile | null;
}

export const ApiService = {
	async fetchSession(): Promise<GoogleProfile | null> {
		const { data } = await axios.get<SessionResponse>("/auth/me");
		return data?.user ?? null;
	},

	async logout(): Promise<void> {
		await axios.post("/auth/logout");
	},
};

export function startGoogleLogin(): void {
	window.location.href = `${API_URL}/auth/google`;
}
