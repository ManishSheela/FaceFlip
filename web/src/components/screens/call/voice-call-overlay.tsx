import { RadarRings } from "@/components/blueprint/radar-rings";

interface VoiceCallOverlayProps {
  initials: string;
  targetName: string;
  timeLabel: string;
}

/** Full-bleed audio-call overlay: pulsing rings around a friend's avatar. */
export function VoiceCallOverlay({
  initials,
  targetName,
  timeLabel,
}: VoiceCallOverlayProps) {
  return (
    <div
      className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-5"
      style={{
        backgroundImage:
          "linear-gradient(160deg, var(--color-accent-900), var(--color-accent-700))",
      }}
    >
      <RadarRings
        size={150}
        delays={[0, 0.7]}
        durationSec={2}
        ringClassName="border-accent-400"
      >
        <div className="flex h-24 w-24 items-center justify-center border border-accent-400 bg-accent-800 font-heading text-[28px] text-accent-900">
          {initials}
        </div>
      </RadarRings>

      <div className="text-center">
        <div className="mb-1 font-heading text-[22px] text-accent-900">
          {targetName}
        </div>
        <div className="text-sm text-accent-700">{timeLabel}</div>
      </div>
    </div>
  );
}
