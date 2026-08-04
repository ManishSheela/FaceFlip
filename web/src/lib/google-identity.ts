const SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

let loadPromise: Promise<void> | null = null;

/** Loads the Google Identity Services script once; the promise is shared across callers. */
export function loadGoogleIdentityScript(): Promise<void> {
	if (typeof window === "undefined") {
		return Promise.reject(
			new Error("loadGoogleIdentityScript can only run in the browser"),
		);
	}
	if (window.google?.accounts?.oauth2) return Promise.resolve();
	if (loadPromise) return loadPromise;

	loadPromise = new Promise((resolve, reject) => {
		const script =
			document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`) ??
			Object.assign(document.createElement("script"), {
				src: SCRIPT_SRC,
				async: true,
				defer: true,
			});

		script.addEventListener("load", () => resolve());
		script.addEventListener("error", () => {
			loadPromise = null;
			reject(new Error("Couldn't reach Google. Check your connection."));
		});

		if (!script.parentNode) document.head.appendChild(script);
	});

	return loadPromise;
}

/** Exchanges a Google access token for the signed-in user's basic profile. */
export async function fetchGoogleUserInfo(accessToken: string) {
	const res = await fetch(USERINFO_URL, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!res.ok) throw new Error("Couldn't load your Google profile.");

	const data: {
		sub: string;
		name?: string;
		email?: string;
		picture?: string;
	} = await res.json();

	return {
		id: data.sub,
		name: data.name ?? "",
		email: data.email ?? "",
		picture: data.picture,
	};
}
