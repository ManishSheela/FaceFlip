import { axios } from "@/lib/axios";
import { getSessionToken } from "@/lib/get-session-token";

export const ApiService = {
	async fetchSession() {
		const { data } = await axios.get("/auth/me");
		return (data as any)?.user ?? null;
	},

	async getServerSession() {
		const token = await getSessionToken();
		if (!token) return { user: null, resolved: false };

		const { data, error, responded } = await axios.get("/auth/me", token);
		if (error) return { user: null, resolved: responded };

		return { user: (data as any).user, resolved: true };
	},

	async logout() {
		await axios.post("/auth/logout");
	},
};
