import baseAxios, { isAxiosError } from "axios";
import { API_URL, REQUEST_TIMEOUT_MS, SESSION_COOKIE } from "@/constants";

const client = baseAxios.create({
	baseURL: API_URL,
	withCredentials: true,
	timeout: REQUEST_TIMEOUT_MS,
});

export interface Result<T> {
	data: T | null;
	error: unknown;
	responded: boolean;
}

function headersFor(token?: string) {
	return token
		? { headers: { cookie: `${SESSION_COOKIE}=${token}` } }
		: undefined;
}

async function handle<T>(promise: Promise<{ data: T }>): Promise<Result<T>> {
	try {
		const res = await promise;
		return { data: res.data, error: null, responded: true };
	} catch (err) {
		const responded = isAxiosError(err) && err.response !== undefined;
		return { data: null, error: err, responded };
	}
}

export const axios = {
	get: <T>(url: string, token?: string) =>
		handle<T>(client.get(url, headersFor(token))),
	post: <T>(url: string, body?: unknown, token?: string) =>
		handle<T>(client.post(url, body, headersFor(token))),
	put: <T>(url: string, body?: unknown, token?: string) =>
		handle<T>(client.put(url, body, headersFor(token))),
	patch: <T>(url: string, body?: unknown, token?: string) =>
		handle<T>(client.patch(url, body, headersFor(token))),
	delete: <T>(url: string, token?: string) =>
		handle<T>(client.delete(url, headersFor(token))),
};
