import type { FeatureCard as FeatureCardData } from "@/types";
import { BlueprintFrame } from "./blueprint-frame";

/** One of the three benefit cards on the landing page. */
export function FeatureCard({ kicker, title, body }: FeatureCardData) {
  return (
    <BlueprintFrame className="flex w-[220px] flex-col gap-1.5 p-3.5 text-left">
      <div className="card-kicker">{kicker}</div>
      <div className="card-title">{title}</div>
      <p className="card-body">{body}</p>
    </BlueprintFrame>
  );
}
