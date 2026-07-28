"use client";

import { useEffect, useRef, useState } from "react";

export function useElapsedTimer(active: boolean): number {
	const [seconds, setSeconds] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (!active) return;
		setSeconds(0);
		intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [active]);

	return seconds;
}
