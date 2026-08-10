import { MarsStroke } from "lucide-react";
import { GENDER_BADGE_LABELS, GENDER_COLORS } from "@/constants";
import type { SocketGender } from "@/types";

type GenderBadgeProps = {
  gender: SocketGender;
};

export function GenderBadge({ gender }: GenderBadgeProps) {
  const color = GENDER_COLORS[gender];

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium backdrop-blur-sm"
      style={{
        color,
        borderColor: color,
        backgroundColor: `${color}1a`,
      }}
    >
      <MarsStroke className="h-3.5 w-3.5" />
      <span>{GENDER_BADGE_LABELS[gender]}</span>
    </span>
  );
}