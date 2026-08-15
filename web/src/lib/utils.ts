import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AGE_CONFIRMED_STORAGE_KEY } from "@/constants";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function loadAgeConfirmed(): boolean {
	try {
		return window.localStorage.getItem(AGE_CONFIRMED_STORAGE_KEY) === "true";
	} catch {
		return false;
	}
}

export function saveAgeConfirmed(confirmed: boolean): void {
	try {
		window.localStorage.setItem(AGE_CONFIRMED_STORAGE_KEY, String(confirmed));
	} catch {
		return;
	}
}

export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}
