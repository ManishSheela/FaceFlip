import baseAxios, { isAxiosError } from "axios";
import { API_URL, REQUEST_TIMEOUT_MS, SESSION_COOKIE } from "@/constants";

const client = baseAxios.create({
	baseURL: API_URL,
	withCredentials: true,
	timeout: REQUEST_TIMEOUT_MS,
});

function headersFor(token?: string) {
	return token ? { headers: { cookie: `${SESSION_COOKIE}=${token}` } } : undefined;
}

async function handle(promise: Promise<{ data: unknown }>) {
	try {
		const res = await promise;
		return { data: res.data, error: null, responded: true };
	} catch (err) {
		const responded = isAxiosError(err) && err.response !== undefined;
		return { data: null, error: err, responded };
	}
}

export const axios = {
	get: (url: string, token?: string) => handle(client.get(url, headersFor(token))),
	post: (url: string, body?: unknown, token?: string) =>
		handle(client.post(url, body, headersFor(token))),
	put: (url: string, body?: unknown, token?: string) =>
		handle(client.put(url, body, headersFor(token))),
	delete: (url: string, token?: string) => handle(client.delete(url, headersFor(token))),
};
