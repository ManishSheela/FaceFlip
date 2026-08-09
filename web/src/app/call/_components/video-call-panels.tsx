"use client";

import { useEffect, useRef } from "react";
import { Loader2, MicOff, VideoOff } from "lucide-react";
import { Tag } from "@/components/blueprint/tag";
import { LOCAL_GRADIENT, REMOTE_GRADIENT } from "@/constants";
import type { PartnerMedia, UserGender } from "@/types";
import { GenderBadge } from "./gender-badge";

interface VideoCallPanelsProps {
  targetName: string;
  targetGender: UserGender | null;
  connected: boolean;
  timeLabel: string;
  camOn: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  partnerMedia?: PartnerMedia;
}

function useStreamRef(stream: MediaStream | null) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.srcObject = stream;
    return () => {
      element.srcObject = null;
    };
  }, [stream]);

  return ref;
}

export function VideoCallPanels({
  targetName,
  targetGender,
  connected,
  timeLabel,
  camOn,
  localStream,
  remoteStream,
  partnerMedia,
}: VideoCallPanelsProps) {
  const localRef = useStreamRef(localStream);
  const remoteRef = useStreamRef(remoteStream);
  const partnerCamOff = partnerMedia?.video === false;
  const partnerMuted = partnerMedia?.audio === false;

  return (
    <>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-accent-800">
        <div
          className="absolute inset-0 opacity-85"
          style={{
            backgroundImage: LOCAL_GRADIENT,
            backgroundSize: "200% 200%",
            animation: "gradientShift 11s ease-in-out infinite",
          }}
        />
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className="relative z-[1] h-full w-full scale-x-[-1] object-cover"
          style={{ visibility: camOn ? "visible" : "hidden" }}
        />
        <div className="absolute left-3.5 top-3.5 z-10">
          <Tag variant="neutral" className="backdrop-blur-sm">
            You
          </Tag>
        </div>
        {!camOn && (
          <div className="absolute z-10 flex flex-col items-center gap-1.5">
            <VideoOff className="h-7 w-7 text-white/60" strokeWidth={1.5} />
            <span className="text-xs text-white/75">Camera off</span>
          </div>
        )}
      </div>

      <div className="z-[2] h-0.5 w-full flex-none bg-white/[0.12] sm:h-auto sm:w-0.5" />

      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-accent-900">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: REMOTE_GRADIENT,
            backgroundSize: "200% 200%",
            animation: "gradientShift 9s ease-in-out infinite",
          }}
        />
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="relative z-[1] h-full w-full object-cover"
        />
        {!remoteStream && (
          <div className="absolute z-10 flex flex-col items-center gap-1.5">
            <Loader2
              className="h-7 w-7 animate-spin text-white/60"
              strokeWidth={1.5}
            />
            <span className="text-xs text-white/75">Connecting video…</span>
          </div>
        )}

        {remoteStream && partnerCamOff && (
          <div className="absolute z-10 flex flex-col items-center gap-1.5">
            <VideoOff className="h-7 w-7 text-white/60" strokeWidth={1.5} />
            <span className="text-xs text-white/75">Camera off</span>
          </div>
        )}
        <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5">
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
          {targetGender && <GenderBadge gender={targetGender} />}
          {partnerMuted && (
            <Tag
              variant="neutral"
              className="flex items-center gap-1 backdrop-blur-sm"
              title="Stranger is muted"
            >
              <MicOff className="h-3 w-3" strokeWidth={1.5} />
              Muted
            </Tag>
          )}
        </div>
        <div className="absolute right-3.5 top-3.5 z-10">
          <Tag variant="neutral" className="font-heading backdrop-blur-sm">
            {timeLabel}
          </Tag>
        </div>
      </div>
    </>
  );
}
