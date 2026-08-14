export const ROUTES = {
	landing: "/",
	auth: "/auth",
	onboarding: "/onboarding",
	gender: "/gender",
	matching: "/matching",
	call: "/call",
	postcall: "/postcall",
	friends: "/friends",
	chat: "/chat",
	settings: "/settings",
} as const;

export const CHROMELESS_ROUTES: string[] = [ROUTES.call, ROUTES.matching];
