import * as React from "react";
import { cn } from "@/lib/utils";

type BlueprintFrameProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
};

/** A rounded, filled card surface — the shared container style used across the app. */
export function BlueprintFrame({
  as: Comp = "div",
  className,
  children,
  ...props
}: BlueprintFrameProps) {
  return (
    <Comp className={cn("blueprint relative", className)} {...props}>
      {children}
    </Comp>
  );
}
