import * as React from "react";
import { cn } from "@/lib/utils";
import { BLUEPRINT_CORNERS } from "@/constants";

/** The four `+` registration marks drawn just outside a blueprint box. */
export function CornerMarks() {
  return (
    <>
      {BLUEPRINT_CORNERS.map((c) => (
        <i key={c} className={cn("corner", c)} aria-hidden />
      ))}
    </>
  );
}

type BlueprintFrameProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
};

/**
 * A square, hairline-bordered surface with corner registration marks —
 * the signature container of the Industry / Blueprint aesthetic.
 */
export function BlueprintFrame({
  as: Comp = "div",
  className,
  children,
  ...props
}: BlueprintFrameProps) {
  return (
    <Comp className={cn("blueprint relative", className)} {...props}>
      <CornerMarks />
      {children}
    </Comp>
  );
}
