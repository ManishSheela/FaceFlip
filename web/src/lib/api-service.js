import { API_URL } from "@/constants";
import { axios } from "@/lib/axios";

export const ApiService = {
	async fetchSession() {
		const { data } = await axios.get("/auth/me");
		return data?.user ?? null;
	},

	async updateProfile(patch) {
		const { data } = await axios.patch("/auth/me", patch);
		return data?.user ?? null;
	},

	async logout() {
		await axios.post("/auth/logout");
	},

	async checkoutPremium(plan) {
		const { data } = await axios.post("/premium/checkout", { plan });
		return data?.user ?? null;
	},
};

export function startGoogleLogin() {
	window.location.href = `${API_URL}/auth/google`;
}
