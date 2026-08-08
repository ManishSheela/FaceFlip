import { API_URL } from "@/constants";
import { axios } from "@/lib/axios";

export const ApiService = {
	async fetchSession() {
		const { data } = await axios.get<any>("/auth/me");
		return data?.user ?? null;
	},

	async updateProfile(patch: any) {
		const { data } = await axios.patch<any>("/auth/me", patch);
		return data?.user ?? null;
	},

	async logout() {
		await axios.post("/auth/logout");
	},
};

export function startGoogleLogin() {
	window.location.href = `${API_URL}/auth/google`;
}
