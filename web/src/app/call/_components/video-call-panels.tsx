import { VideoOff } from "lucide-react";
import { Tag } from "@/components/blueprint/tag";

interface VideoCallPanelsProps {
  targetName: string;
  connected: boolean;
  timeLabel: string;
  camOn: boolean;
}

const REMOTE_GRADIENT =
  "linear-gradient(135deg, var(--color-accent-900), var(--color-accent-700), var(--color-accent-800))";
const LOCAL_GRADIENT =
  "linear-gradient(225deg, var(--color-accent-800), var(--color-accent-900), var(--color-accent-700))";

/** Side-by-side remote + local video placeholders (animated gradients). */
export function VideoCallPanels({
  targetName,
  connected,
  timeLabel,
  camOn,
}: VideoCallPanelsProps) {
  return (
    <>
      <div className="relative flex-1 overflow-hidden bg-accent-900">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: REMOTE_GRADIENT,
            backgroundSize: "200% 200%",
            animation: "gradientShift 9s ease-in-out infinite",
          }}
        />
        <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5">
          <Tag variant="neutral" className="backdrop-blur-sm">
            {targetName}
          </Tag>
          {connected ? (
            <Tag variant="accent" className="backdrop-blur-sm">
              Connected
            </Tag>
          ) : (
            <Tag variant="outline" className="backdrop-blur-sm">
              Connecting…
            </Tag>
          )}
        </div>
        <div className="absolute right-3.5 top-3.5">
          <Tag variant="neutral" className="font-heading backdrop-blur-sm">
            {timeLabel}
          </Tag>
        </div>
      </div>

      <div className="z-[2] h-0.5 w-full flex-none bg-white/[0.12] sm:h-auto sm:w-0.5" />

      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-accent-800">
        <div
          className="absolute inset-0 opacity-85"
          style={{
            backgroundImage: LOCAL_GRADIENT,
            backgroundSize: "200% 200%",
            animation: "gradientShift 11s ease-in-out infinite",
          }}
        />
        <div className="absolute left-3.5 top-3.5">
          <Tag variant="neutral" className="backdrop-blur-sm">
            You
          </Tag>
        </div>
        {!camOn && (
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <VideoOff className="h-7 w-7 text-white/60" strokeWidth={1.5} />
            <span className="text-xs text-white/75">Camera off</span>
          </div>
        )}
      </div>
    </>
  );
}
