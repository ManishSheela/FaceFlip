import * as React from "react";
import { cn } from "@/lib/utils";

interface RadarRingsProps {
  /** Diameter of each ring in pixels. */
  size: number;
  /** Stagger delays (seconds) — one ring is rendered per entry. */
  delays?: number[];
  /** Full pulse duration in seconds. */
  durationSec?: number;
  /** Tailwind border-color class for the rings. */
  ringClassName?: string;
  /** Content rendered centered inside the rings. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Concentric circles that pulse outward — the "scanning" radar used on the
 * matching screen and the voice-call overlay. Rings sit behind `children`.
 */
export function RadarRings({
  size,
  delays = [0, 0.75, 1.5],
  durationSec = 2.2,
  ringClassName = "border-accent",
  children,
  className,
}: RadarRingsProps) {
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {delays.map((delay, i) => (
        <span
          key={i}
          aria-hidden
          className={cn("absolute inset-0 rounded-full border", ringClassName)}
          style={{
            animation: `radarPulse ${durationSec}s ease-out infinite`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
      {children}
    </div>
  );
}
