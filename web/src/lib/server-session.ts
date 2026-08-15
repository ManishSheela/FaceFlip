import type { ServerSession } from "@/types";

export async function getServerSession(): Promise<ServerSession> {
	return { user: null, resolved: false };
}
