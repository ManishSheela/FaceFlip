import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/constants";
import { axios } from "@/lib/axios";
import type { GoogleProfile, ServerSession } from "@/types";

interface SessionResponse {
	user: GoogleProfile | null;
}

export async function getServerSession(): Promise<ServerSession> {
	const token = (await cookies()).get(SESSION_COOKIE)?.value;
	if (!token) return { user: null, resolved: true };

	const { data, error, responded } = await axios.get<SessionResponse>(
		"/auth/me",
		token,
	);
	if (error) return { user: null, resolved: responded };

	return { user: data?.user ?? null, resolved: true };
}
