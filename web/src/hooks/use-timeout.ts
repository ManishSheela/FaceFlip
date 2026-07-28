"use client";

import { useEffect, useRef } from "react";

/**
 * Runs `callback` once after `delayMs`. Pass `delayMs = null` to disable.
 * The latest callback is always used without resetting the timer.
 */
export function useTimeout(callback: () => void, delayMs: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delayMs === null) return;
    const id = setTimeout(() => savedCallback.current(), delayMs);
    return () => clearTimeout(id);
  }, [delayMs]);
}
