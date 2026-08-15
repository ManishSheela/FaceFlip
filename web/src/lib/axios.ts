import baseAxios, { isAxiosError } from "axios";
import { API_URL, REQUEST_TIMEOUT_MS } from "@/constants";

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
	get: <T>(url: string) => handle<T>(client.get(url)),
	post: <T>(url: string, body?: unknown) => handle<T>(client.post(url, body)),
	put: <T>(url: string, body?: unknown) => handle<T>(client.put(url, body)),
	patch: <T>(url: string, body?: unknown) =>
		handle<T>(client.patch(url, body)),
	delete: <T>(url: string) => handle<T>(client.delete(url)),
};
