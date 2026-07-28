import * as React from "react";
import { cn } from "@/lib/utils";
import { BlueprintFrame } from "./blueprint-frame";

interface SectionCardProps {
  /** Uppercase kicker label shown in the header. */
  kicker: string;
  /** Optional leading icon (typically a lucide icon at 13px, accent stroke). */
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

/**
 * A blueprint card with a bordered header (icon + kicker) and a padded body.
 * Used for every card on the Settings screen and the Friends lists.
 */
export function SectionCard({
  kicker,
  icon,
  children,
  className,
  bodyClassName,
}: SectionCardProps) {
  return (
    <BlueprintFrame className={cn("bg-transparent shadow-elev-sm", className)}>
      <div className="flex items-center gap-2 border-b border-divider px-4 py-2.5">
        {icon && <span className="text-accent">{icon}</span>}
        <span className="card-kicker">{kicker}</span>
      </div>
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </BlueprintFrame>
  );
}
