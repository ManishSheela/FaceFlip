export const ROUTES = {
	landing: "/",
	auth: "/auth",
	onboarding: "/onboarding",
	gender: "/gender",
	call: "/call",
} as const;

export const CHROMELESS_ROUTES: string[] = [ROUTES.call];
