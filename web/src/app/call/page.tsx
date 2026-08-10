"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MATCH_END_MESSAGES, MATCH_ERROR_MESSAGES, ROUTES } from "@/constants";
import { useFaceFlip } from "@/hooks/use-faceflip";
import { useMatchFilters } from "@/hooks/use-match-filters";
import { useSession } from "@/hooks/use-session";
import { useElapsedTimer } from "@/hooks/use-elapsed-timer";
import { formatDuration, getInitials } from "@/lib/utils";
import { Loader2, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EndCallDialog } from "@/components/dialogs/end-call-dialog";
import { ReportDialog } from "@/components/dialogs/report-dialog";
import { VideoCallPanels } from "./_components/video-call-panels";
import { CallControlBar } from "./_components/call-control-bar";
import { StrangerChatPanel } from "./_components/stranger-chat-panel";

export default function CallPage() {
	const router = useRouter();
	const filters = useMatchFilters();
	const { isAuthenticated } = useSession();
	const {
		status,
		mediaState,
		mediaError,
		ensureMedia,
		partner,
		matchSource,
		endedReason,
		localStream,
		remoteStream,
		audioEnabled,
		videoEnabled,
		partnerMedia,
		messages,
		partnerTyping,
		friendRequestState,
		skip,
		stop,
		sendMessage,
		sendTyping,
		toggleAudio,
		toggleVideo,
		reportUser,
		sendFriendRequest,
	} = useFaceFlip();

	const [endOpen, setEndOpen] = useState(false);
	const [reportOpen, setReportOpen] = useState(false);
	const [chatOpen, setChatOpen] = useState(false);
	const [readCount, setReadCount] = useState(0);
	const leavingRef = useRef(false);

	const elapsed = useElapsedTimer();
	const inCall = status === "matched" || status === "connected";
	const inCallRef = useRef(inCall);
	inCallRef.current = inCall;

	const targetName = partner?.name ?? (matchSource === "friend" ? "Friend" : "Stranger");
	const unreadCount = Math.max(messages.length - readCount, 0);

	useEffect(() => {
		if (chatOpen) setReadCount(messages.length);
	}, [chatOpen, messages.length]);

	useEffect(() => {
		if (inCall) void ensureMedia();
	}, [inCall, ensureMedia]);

	useEffect(() => {
		if (leavingRef.current || inCall) return;

		if (endedReason) toast(MATCH_END_MESSAGES[endedReason] ?? "Call ended.");
		router.replace(ROUTES.matching);
	}, [inCall, endedReason, router]);

	useEffect(() => {
		return () => {
			if (!leavingRef.current && inCallRef.current) stop();
		};
	}, [stop]);

	if (!inCall) return null;

	if (mediaState === "error") {
		return (
			<section className="flex flex-1 animate-fade-slide-in items-center justify-center p-5">
				<div className="flex max-w-[420px] flex-col items-center gap-3.5 border border-divider p-5 text-center">
					<VideoOff className="h-8 w-8 text-accent" strokeWidth={1.5} />
					<h3 className="m-0 text-lg">Camera unavailable</h3>
					<p className="text-muted m-0 text-sm">
						{mediaError ? MATCH_ERROR_MESSAGES[mediaError] : ""}
					</p>
					<div className="flex gap-2.5">
						<Button variant="primary" blueprint onClick={() => void ensureMedia()}>
							Try again
						</Button>
						<Button
							variant="secondary"
							onClick={() => {
								leavingRef.current = true;
								stop();
								router.replace(ROUTES.landing);
							}}
						>
							Leave
						</Button>
					</div>
				</div>
			</section>
		);
	}

	const leaveTo = (href: string) => {
		leavingRef.current = true;
		router.push(href);
	};

	const endCall = () => {
		setEndOpen(false);
		stop();
		leaveTo(`${ROUTES.postcall}?d=${elapsed}`);
	};

	const findNext = () => {
		skip(filters);
		leaveTo(ROUTES.matching);
	};

	const canAddFriend =
		isAuthenticated && matchSource === "random" && partner?.isGuest === false;

	return (
		<section className="relative flex min-h-[520px] flex-1 animate-fade-slide-in flex-col overflow-hidden sm:flex-row">
			<VideoCallPanels
				targetName={targetName}
				targetGender={partner?.gender ?? null}
				connected={status === "connected"}
				timeLabel={formatDuration(elapsed)}
				camOn={videoEnabled}
				localStream={localStream}
				remoteStream={remoteStream}
				partnerMedia={partnerMedia}
			/>

			{mediaState === "requesting" && (
				<div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-bg/85 backdrop-blur-sm">
					<Loader2 className="h-7 w-7 animate-spin text-accent" strokeWidth={1.5} />
					<p className="m-0 text-sm font-medium">Allow camera and microphone</p>
					<p className="text-muted m-0 text-xs">
						Your match is waiting for your video.
					</p>
				</div>
			)}

			{chatOpen && (
				<StrangerChatPanel
					messages={messages}
					partnerTyping={partnerTyping}
					partnerInitials={getInitials(targetName)}
					onSend={sendMessage}
					onTyping={sendTyping}
					onClose={() => setChatOpen(false)}
				/>
			)}

			<CallControlBar
				micOn={audioEnabled}
				camOn={videoEnabled}
				isVideo
				isFriendCall={matchSource === "friend"}
				chatOpen={chatOpen}
				unreadCount={unreadCount}
				friendRequestState={friendRequestState}
				canAddFriend={canAddFriend}
				onToggleChat={() => setChatOpen((open) => !open)}
				onToggleMic={toggleAudio}
				onToggleCam={toggleVideo}
				onNext={findNext}
				onAddFriend={sendFriendRequest}
				onEnd={() => setEndOpen(true)}
				onReport={() => setReportOpen(true)}
				onSettings={() => leaveTo(`${ROUTES.settings}?from=call`)}
			/>

			<EndCallDialog
				open={endOpen}
				onOpenChange={setEndOpen}
				onConfirm={endCall}
			/>
			<ReportDialog
				open={reportOpen}
				onOpenChange={setReportOpen}
				onSubmit={reportUser}
			/>
		</section>
	);
}
