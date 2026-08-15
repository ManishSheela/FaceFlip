import { cn } from "@/lib/utils";
import type { FeatureCard as FeatureCardData } from "@/types";
import { BlueprintFrame } from "./blueprint-frame";

/** One of the benefit cards on the landing page. */
export function FeatureCard({ kicker, title, body, premium }: FeatureCardData) {
  return (
    <BlueprintFrame
      bracketColor={premium ? "var(--color-amber)" : undefined}
      className={cn(
        "flex w-full flex-col gap-1.5 p-3.5 text-left",
        premium && "border-amber-tint bg-amber-tint",
      )}
    >
      <div className={cn("card-kicker", premium && "text-amber")}>{kicker}</div>
      <div className="card-title">{title}</div>
      <p className="card-body">{body}</p>
    </BlueprintFrame>
  );
}
