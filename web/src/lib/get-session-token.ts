import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/constants";

export async function getSessionToken(): Promise<string | null> {
	const token = (await cookies()).get(SESSION_COOKIE)?.value;
	return token ?? null;
}
