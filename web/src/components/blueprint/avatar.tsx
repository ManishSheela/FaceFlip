import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  /** Pixel size of the circular avatar. */
  size?: number;
  /** Show a thicker accent border (used for the profile avatar). */
  framed?: boolean;
  /** Show the green online indicator dot. */
  online?: boolean;
  className?: string;
}

/** Circular initials avatar. */
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
          "flex h-full w-full items-center justify-center rounded-full bg-accent-100 font-heading font-semibold text-accent-800",
          framed ? "border-2 border-accent" : "border border-divider",
          className,
        )}
        style={{ fontSize: Math.round(size * 0.32) }}
      >
        {initials}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-bg bg-green" />
      )}
    </div>
  );
}
