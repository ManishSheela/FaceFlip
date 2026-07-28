import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva("tag", {
  variants: {
    variant: {
      accent: "tag-accent",
      neutral: "tag-neutral",
      outline: "tag-outline",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

export function Tag({ className, variant, ...props }: TagProps) {
  return <span className={cn(tagVariants({ variant }), className)} {...props} />;
}
