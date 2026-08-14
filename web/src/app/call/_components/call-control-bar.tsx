"use client";

import { Flag, MessageSquare, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tag } from "@/components/blueprint/tag";

interface CallControlBarProps {
	micOn: boolean;
	camOn: boolean;
	isVideo: boolean;
	isFriendCall: boolean;
	chatOpen?: boolean;
	unreadCount?: number;
	onToggleChat?: () => void;
	onToggleMic: () => void;
	onToggleCam: () => void;
	onNext: () => void;
	onReport: () => void;
}

const ICON_PROPS = { className: "h-[18px] w-[18px]", strokeWidth: 2 } as const;

const DOCK_BUTTON =
	"flex h-12 w-12 items-center justify-center rounded-full border-none transition-colors cursor-pointer";
const DOCK_LABEL =
	"font-heading text-[9px] uppercase tracking-[0.04em] text-white/70";

/** The floating call controls anchored over the "your feed" half of the call screen. */
export function CallControlBar({
	micOn,
	camOn,
	isVideo,
	isFriendCall,
	chatOpen,
	unreadCount = 0,
	onToggleChat,
	onToggleMic,
	onToggleCam,
	onNext,
	onReport,
}: CallControlBarProps) {
	return (
		<div className="absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-3.5 rounded-[44px] bg-black/50 px-7 py-3.5 backdrop-blur-[10px] sm:left-1/4">
			<div className="flex flex-col items-center gap-1.5">
				<button
					type="button"
					onClick={onToggleMic}
					title={micOn ? "Mute" : "Unmute"}
					className={cn(DOCK_BUTTON, micOn ? "bg-call-panel" : "bg-red")}
				>
					{micOn ? (
						<Mic {...ICON_PROPS} className={cn(ICON_PROPS.className, "text-white")} />
					) : (
						<MicOff {...ICON_PROPS} className={cn(ICON_PROPS.className, "text-white")} />
					)}
				</button>
				<span className={DOCK_LABEL}>{micOn ? "Mic on" : "Muted"}</span>
			</div>

			{isVideo && (
				<div className="flex flex-col items-center gap-1.5">
					<button
						type="button"
						onClick={onToggleCam}
						title={camOn ? "Camera off" : "Camera on"}
						className={cn(DOCK_BUTTON, camOn ? "bg-call-panel" : "bg-red")}
					>
						{camOn ? (
							<Video {...ICON_PROPS} className={cn(ICON_PROPS.className, "text-white")} />
						) : (
							<VideoOff {...ICON_PROPS} className={cn(ICON_PROPS.className, "text-white")} />
						)}
					</button>
					<span className={DOCK_LABEL}>{camOn ? "Cam on" : "Cam off"}</span>
				</div>
			)}

			{!isFriendCall && (
				<div className="flex flex-col items-center gap-1.5">
					<button
						type="button"
						onClick={onNext}
						title="Flip again"
						className="flex h-[68px] w-[68px] cursor-pointer flex-col items-center justify-center rounded-full border-none bg-accent text-center font-heading text-[11px] font-bold leading-[1.3] text-on-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]"
					>
						<span>Flip</span>
						<span>again</span>
					</button>
					<span className="font-heading text-[9px] uppercase tracking-[0.04em] text-accent">
						Next
					</span>
				</div>
			)}

			{onToggleChat && (
				<div className="flex flex-col items-center gap-1.5">
					<button
						type="button"
						onClick={onToggleChat}
						title={chatOpen ? "Hide chat" : "Show chat"}
						className={cn(
							DOCK_BUTTON,
							"relative",
							chatOpen ? "bg-accent-2" : "bg-call-panel",
						)}
					>
						<MessageSquare className="h-4 w-4 text-white" strokeWidth={2} />
						{unreadCount > 0 && !chatOpen && (
							<Tag
								variant="accent"
								className="absolute -right-1 -top-1 px-1 py-0 text-[10px]"
							>
								{unreadCount}
							</Tag>
						)}
					</button>
					<span className={DOCK_LABEL}>Chat</span>
				</div>
			)}

			<div className="flex flex-col items-center gap-1.5">
				<button
					type="button"
					onClick={onReport}
					title="Report"
					className={cn(DOCK_BUTTON, "bg-call-panel")}
				>
					<Flag
						className="h-4 w-4"
						style={{ color: "oklch(0.75 0.1 25)" }}
						strokeWidth={2.2}
					/>
				</button>
				<span className={DOCK_LABEL}>Report</span>
			</div>
		</div>
	);
}
