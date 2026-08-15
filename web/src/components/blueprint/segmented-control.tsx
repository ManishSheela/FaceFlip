"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  /** Pass `null` when no option should render as active yet. */
  value: T | null;
  onValueChange: (value: T) => void;
  /** Options rendered with a lock icon; clicking one calls `onLockedSelect` instead of `onValueChange`. */
  lockedValues?: T[];
  onLockedSelect?: (value: T) => void;
  className?: string;
  "aria-label"?: string;
}

/**
 * The `.seg` segmented control: a hairline-bordered row of options where the
 * active one fills with the accent colour. Generic over its value type.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  lockedValues,
  onLockedSelect,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex overflow-hidden rounded-md border border-divider",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        const locked = lockedValues?.includes(option.value) ?? false;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() =>
              locked ? onLockedSelect?.(option.value) : onValueChange(option.value)
            }
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-[7px] text-[13px] transition-colors",
              "border-l border-divider first:border-l-0 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
              active
                ? "bg-accent text-on-accent"
                : "text-text hover:bg-[color-mix(in_srgb,var(--color-text)_7%,transparent)]",
            )}
          >
            {option.label}
            {locked && <Lock className="h-3 w-3" strokeWidth={2} />}
          </button>
        );
      })}
    </div>
  );
}
