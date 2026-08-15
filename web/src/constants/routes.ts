export const ROUTES = {
	landing: "/",
	auth: "/auth",
	onboarding: "/onboarding",
	gender: "/gender",
	call: "/call",
	friends: "/friends",
	chat: "/chat",
	settings: "/settings",
} as const;

export const CHROMELESS_ROUTES: string[] = [ROUTES.call];
