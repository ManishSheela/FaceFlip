import * as React from "react";
import { cn } from "@/lib/utils";
import { CornerBrackets } from "./corner-brackets";

type BlueprintFrameProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  /** Corner-bracket color — defaults to the accent color. */
  bracketColor?: string;
};

/** A sharp-cornered, bracketed card surface — the shared container style used across the app. */
export function BlueprintFrame({
  as: Comp = "div",
  className,
  bracketColor,
  children,
  ...props
}: BlueprintFrameProps) {
  return (
    <Comp className={cn("blueprint relative rounded-none", className)} {...props}>
      <CornerBrackets color={bracketColor} />
      {children}
    </Comp>
  );
}
