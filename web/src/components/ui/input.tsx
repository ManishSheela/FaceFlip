"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CornerBrackets } from "@/components/blueprint/corner-brackets";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <div className="relative">
        <CornerBrackets size={5} color="var(--color-accent-400)" />
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full min-h-9 rounded-none border border-divider bg-surface px-2.5 py-1.5 text-sm text-text caret-accent",
            "transition-colors placeholder:text-muted",
            "hover:border-[color-mix(in_srgb,var(--color-text)_45%,transparent)]",
            "focus-visible:border-accent focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-60",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";
