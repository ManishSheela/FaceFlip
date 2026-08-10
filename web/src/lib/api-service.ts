import { API_URL } from "@/constants";
import { axios } from "@/lib/axios";
import type { GenderPref, GoogleProfile, UserGender } from "@/types";

interface SessionResponse {
	user?: GoogleProfile;
}

export interface ProfilePatch {
	gender?: UserGender;
	genderPref?: GenderPref;
}

export const ApiService = {
	async fetchSession(): Promise<GoogleProfile | null> {
		const { data } = await axios.get<SessionResponse>("/auth/me");
		return data?.user ?? null;
	},

	async updateProfile(patch: ProfilePatch): Promise<GoogleProfile | null> {
		const { data } = await axios.patch<SessionResponse>("/auth/me", patch);
		return data?.user ?? null;
	},

	async logout(): Promise<void> {
		await axios.post("/auth/logout");
	},
};

export function startGoogleLogin() {
	window.location.href = `${API_URL}/auth/google`;
}
