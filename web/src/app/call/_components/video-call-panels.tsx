"use client";

import { useEffect, useRef, useState } from "react";
import { MicOff, Sun, VideoOff } from "lucide-react";
import type { PartnerMedia, SocketGender } from "@/types";
import { GenderBadge } from "./gender-badge";

interface VideoCallPanelsProps {
	targetGender: SocketGender | null;
	camOn: boolean;
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;
	partnerMedia?: PartnerMedia;
	searching: boolean;
}

const MAX_BLUR_PX = 15;

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
	targetGender,
	camOn,
	localStream,
	remoteStream,
	partnerMedia,
	searching,
}: VideoCallPanelsProps) {
	const localRef = useStreamRef(localStream);
	const remoteRef = useStreamRef(remoteStream);
	const partnerCamOff = partnerMedia?.video === false;
	const partnerMuted = partnerMedia?.audio === false;
	const [blurLevel, setBlurLevel] = useState(0);

	return (
		<>
			<div className="relative flex-1 overflow-hidden border-call-divider sm:border-r">
				<div
					className="video-stripe-you absolute inset-0 flex items-center justify-center"
					style={{
						filter: blurLevel > 0 ? `blur(${blurLevel * MAX_BLUR_PX}px)` : "none",
					}}
				>
					<span className="font-heading text-[11px] uppercase tracking-[0.06em] text-white/30">
						Your video feed
					</span>
					<video
						ref={localRef}
						autoPlay
						playsInline
						muted
						className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
						style={{ visibility: camOn ? "visible" : "hidden" }}
					/>
					{!camOn && (
						<div className="absolute flex flex-col items-center gap-1.5">
							<VideoOff className="h-7 w-7 text-white/60" strokeWidth={1.5} />
							<span className="text-xs text-white/75">Camera off</span>
						</div>
					)}
				</div>

				<div className="absolute right-3.5 top-3.5 z-[5] flex h-8 items-center gap-2 whitespace-nowrap rounded-3xl border border-white/10 bg-black/50 px-3 backdrop-blur-md">
					<Sun className="h-[13px] w-[13px] text-call-muted" strokeWidth={2} />
					<span className="font-heading text-[9px] uppercase tracking-[0.06em] text-call-muted">
						Blur
					</span>
					<input
						type="range"
						min={0}
						max={1}
						step={0.1}
						value={blurLevel}
						onChange={(e) => setBlurLevel(Number(e.target.value))}
						aria-label="Blur your video"
						className="w-20 cursor-pointer"
						style={{ accentColor: "var(--color-accent)" }}
					/>
					<span className="min-w-[14px] font-heading text-[10px] font-semibold text-accent-400">
						{blurLevel}
					</span>
				</div>
			</div>

			<div className="relative flex-1 overflow-hidden">
				<div className="video-stripe-partner absolute inset-0 flex items-center justify-center">
					<span className="font-heading text-[11px] uppercase tracking-[0.06em] text-white/25">
						Partner video feed
					</span>
					<video
						ref={remoteRef}
						autoPlay
						playsInline
						className="absolute inset-0 h-full w-full object-cover"
					/>
					{remoteStream && partnerCamOff && (
						<div className="absolute flex flex-col items-center gap-1.5">
							<VideoOff className="h-7 w-7 text-white/60" strokeWidth={1.5} />
							<span className="text-xs text-white/75">Camera off</span>
						</div>
					)}
				</div>

				{!remoteStream && (
					<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3.5 bg-call-bg/90 backdrop-blur-[4px]">
						<span className="h-10 w-10 animate-spin rounded-full border-[3px] border-call-panel border-t-accent" />
						<span className="font-heading text-xs uppercase tracking-[0.04em] text-call-muted">
							{searching ? "Looking for your next flip…" : "Connecting…"}
						</span>
					</div>
				)}

				<div className="absolute left-3.5 top-3.5 z-[2] flex flex-wrap items-center gap-1.5">
					{targetGender && <GenderBadge gender={targetGender} />}
					{partnerMuted && (
						<span
							className="flex h-8 items-center gap-1.5 rounded-3xl border border-white/10 bg-black/50 px-3 backdrop-blur-md"
							title="Stranger is muted"
						>
							<MicOff className="h-3 w-3 text-white/80" strokeWidth={1.8} />
							<span className="text-[11px] font-semibold text-white/80">
								Muted
							</span>
						</span>
					)}
				</div>
			</div>
		</>
	);
}
