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

	async createPremiumOrder(plan) {
		const { data } = await axios.post("/premium/orders", { plan });
		return data ?? null;
	},

	async verifyPremiumPayment(payment) {
		const { data } = await axios.post("/premium/verify", payment);
		return data?.user ?? null;
	},
};

export function startGoogleLogin() {
	window.location.href = `${API_URL}/auth/google`;
}
