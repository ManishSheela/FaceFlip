import { MarsStroke } from "lucide-react";
import { GENDER_BADGE_LABELS, GENDER_COLORS } from "@/constants";
import type { SocketGender } from "@/types";

type GenderBadgeProps = {
  gender: SocketGender;
};

export function GenderBadge({ gender }: GenderBadgeProps) {
  const color = GENDER_COLORS[gender];

  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 backdrop-blur-md">
      <MarsStroke className="h-3.5 w-3.5" style={{ color }} strokeWidth={2.2} />
      <span className="text-[11px] font-semibold" style={{ color }}>
        {GENDER_BADGE_LABELS[gender]}
      </span>
    </span>
  );
}