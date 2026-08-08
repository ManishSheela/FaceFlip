"use client";

import { useEffect, useState } from "react";

export function useElapsedTimer(): number {
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		const id = setInterval(() => setSeconds((s) => s + 1), 1000);
		return () => clearInterval(id);
	}, []);

	return seconds;
}
