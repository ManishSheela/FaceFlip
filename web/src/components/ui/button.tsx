"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Blueprint button. Mirrors the Industry design-system `.btn` classes:
 * square corners, hairline border, Barlow Condensed label.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-none border font-heading font-semibold text-sm leading-tight transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-on-accent border-accent hover:bg-accent-600 active:bg-accent-700",
        secondary:
          "border-divider text-text hover:bg-[color-mix(in_srgb,var(--color-text)_7%,transparent)] active:bg-[color-mix(in_srgb,var(--color-text)_14%,transparent)]",
        ghost:
          "border-transparent text-accent hover:bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] active:bg-[color-mix(in_srgb,var(--color-accent)_18%,transparent)]",
        danger: "bg-[#c0392b] text-white border-[#c0392b] hover:opacity-90",
        glass:
          "bg-white/[0.14] text-white border-white/30 hover:bg-white/20 active:bg-white/25",
      },
      size: {
        default: "h-9 px-3.5 py-1.5",
        sm: "h-8 px-3 text-[13px]",
        lg: "h-[46px] px-6 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  },
);

const CORNERS = ["tl", "tr", "bl", "br"] as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Render the four blueprint corner registration marks. */
  blueprint?: boolean;
  /** Stretch to full width (adds a small top margin, matching `.btn-block`). */
  block?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, blueprint = false, block = false, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          blueprint && "blueprint relative",
          block && "w-full",
          className,
        )}
        {...props}
      >
        {blueprint &&
          CORNERS.map((c) => <i key={c} className={cn("corner", c)} aria-hidden />)}
        <Slottable>{children}</Slottable>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
