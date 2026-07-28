import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  /** Pixel size of the square avatar. */
  size?: number;
  /** Show an accent border + inner corner ticks (used for the profile avatar). */
  framed?: boolean;
  /** Show the green online indicator dot. */
  online?: boolean;
  className?: string;
}

const TICK_POSITIONS = [
  "top-[-4px] left-[-4px] border-t border-l",
  "top-[-4px] right-[-4px] border-t border-r",
  "bottom-[-4px] left-[-4px] border-b border-l",
  "bottom-[-4px] right-[-4px] border-b border-r",
] as const;

/** Square initials avatar in the blueprint style. */
export function Avatar({
  initials,
  size = 40,
  framed = false,
  online = false,
  className,
}: AvatarProps) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-accent-100 font-heading font-semibold text-accent-800",
          framed ? "border border-accent" : "border border-divider",
          className,
        )}
        style={{ fontSize: Math.round(size * 0.32) }}
      >
        {framed &&
          TICK_POSITIONS.map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={cn("absolute h-1.5 w-1.5 border-accent", pos)}
            />
          ))}
        {initials}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-bg bg-[#22c55e]" />
      )}
    </div>
  );
}
