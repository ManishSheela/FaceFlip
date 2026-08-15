"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MATCH_END_MESSAGES, MATCH_ERROR_MESSAGES, ROUTES } from "@/constants";
import { useFaceFlip } from "@/hooks/use-faceflip";
import { useMatchFilters } from "@/hooks/use-match-filters";
import { useSession, useSessionActions } from "@/hooks/use-session";
import { Loader2, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EndCallDialog } from "@/components/dialogs/end-call-dialog";
import { ReportDialog } from "@/components/dialogs/report-dialog";
import { VideoCallPanels } from "./_components/video-call-panels";
import { CallControlBar } from "./_components/call-control-bar";
import { CallMenu } from "./_components/call-menu";
import { CallFriendsDrawer } from "./_components/call-friends-drawer";
import { CallSettingsDrawer } from "./_components/call-settings-drawer";
import { ChatWithFilter } from "./_components/chat-with-filter";
import { StrangerChatPanel } from "./_components/stranger-chat-panel";

export default function CallPage() {
	const router = useRouter();
	const filters = useMatchFilters();
	const { isAuthenticated, genderPref } = useSession();
	const { setGenderPref } = useSessionActions();
	const {
		status,
		error,
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
		startSearching,
		skip,
		stop,
		sendMessage,
		sendTyping,
		toggleAudio,
		toggleVideo,
		reportUser,
		blockAndSkip,
		sendFriendRequest,
	} = useFaceFlip();

	const [endOpen, setEndOpen] = useState(false);
	const [reportOpen, setReportOpen] = useState(false);
	const [chatOpen, setChatOpen] = useState(false);
	const [drawer, setDrawer] = useState<"settings" | "friends" | null>(null);
	const [readCount, setReadCount] = useState(0);
	const leavingRef = useRef(false);
	const mountedRef = useRef(false);
	const filtersRef = useRef(filters);
	filtersRef.current = filters;

	const searching = status === "searching";
	const partnerFound = status === "matched" || status === "connected";
	const inCall = searching || partnerFound;
	const inCallRef = useRef(inCall);
	inCallRef.current = inCall;

	const unreadCount = Math.max(messages.length - readCount, 0);

	useEffect(() => {
		if (chatOpen) setReadCount(messages.length);
	}, [chatOpen, messages.length]);

	useEffect(() => {
		if (leavingRef.current || status !== "idle") return;

		if (endedReason) toast(MATCH_END_MESSAGES[endedReason] ?? "Call ended.");
		startSearching(filtersRef.current);
	}, [status, endedReason, startSearching]);

	useEffect(() => {
		if (error) toast(MATCH_ERROR_MESSAGES[error]);
	}, [error]);

	useEffect(() => {
		const id = requestAnimationFrame(() => {
			mountedRef.current = true;
		});
		return () => cancelAnimationFrame(id);
	}, []);

	useEffect(() => {
		return () => {
			if (mountedRef.current && !leavingRef.current && inCallRef.current) {
				stop();
			}
		};
	}, [stop]);

	if (mediaState === "error") {
		return (
			<section className="flex flex-1 animate-fade-slide-in items-center justify-center bg-call-bg p-5">
				<div className="flex max-w-[420px] flex-col items-center gap-3.5 rounded-lg border border-call-divider bg-call-panel p-5 text-center">
					<VideoOff className="h-8 w-8 text-accent" strokeWidth={1.5} />
					<h3 className="m-0 text-lg text-white">Camera unavailable</h3>
					<p className="m-0 text-sm text-call-muted">
						{mediaError ? MATCH_ERROR_MESSAGES[mediaError] : ""}
					</p>
					<div className="flex gap-2.5">
						<Button variant="primary" onClick={() => void ensureMedia()}>
							Try again
						</Button>
						<Button
							variant="secondary"
							className="border-call-divider text-white hover:bg-white/10"
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

	const requestMedia = () => {
		void ensureMedia();
	};

	const leaveTo = (href: string) => {
		leavingRef.current = true;
		router.push(href);
	};

	const endCall = () => {
		setEndOpen(false);
		stop();
		leaveTo(ROUTES.landing);
	};

	const findNext = () => {
		skip(filters);
	};

	const canAddFriend =
		isAuthenticated && matchSource === "random" && partner?.isGuest === false;

	return (
		<section className="relative flex min-h-[520px] flex-1 animate-fade-slide-in flex-col overflow-hidden bg-call-bg sm:flex-row">
			<VideoCallPanels
				targetGender={partner?.gender ?? null}
				camOn={videoEnabled}
				localStream={localStream}
				remoteStream={remoteStream}
				partnerMedia={partnerMedia}
				searching={searching}
			/>

			<CallMenu
				canAddFriend={canAddFriend}
				friendRequestState={friendRequestState}
				onAddFriend={sendFriendRequest}
				onFriends={() => setDrawer("friends")}
				onSettings={() => setDrawer("settings")}
				onExit={() => setEndOpen(true)}
			/>

			{drawer === "settings" && (
				<CallSettingsDrawer onClose={() => setDrawer(null)} />
			)}
			{drawer === "friends" && (
				<CallFriendsDrawer onClose={() => setDrawer(null)} />
			)}

			{isAuthenticated && (
				<ChatWithFilter value={genderPref} onChange={setGenderPref} />
			)}

			{mediaState === "idle" && (
				<div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-call-bg/90 px-5 text-center backdrop-blur-sm">
					<Video className="h-7 w-7 text-accent" strokeWidth={1.5} />
					<p className="m-0 text-sm font-medium text-white">
						Camera & microphone access needed
					</p>
					<p className="m-0 max-w-[280px] text-xs text-call-muted">
						We only ask your browser for access once you allow it here.
					</p>
					<Button variant="primary" onClick={requestMedia}>
						Allow camera & microphone
					</Button>
				</div>
			)}

			{mediaState === "requesting" && (
				<div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-call-bg/90 backdrop-blur-sm">
					<Loader2 className="h-7 w-7 animate-spin text-accent" strokeWidth={1.5} />
					<p className="m-0 text-sm font-medium text-white">
						Allow camera and microphone
					</p>
					<p className="m-0 text-xs text-call-muted">
						{partnerFound
							? "Your match is waiting for your video."
							: "We'll start matching once you're set up."}
					</p>
				</div>
			)}

			{chatOpen && (
				<StrangerChatPanel
					messages={messages}
					partnerTyping={partnerTyping}
					onSend={sendMessage}
					onTyping={sendTyping}
				/>
			)}

			<CallControlBar
				micOn={audioEnabled}
				camOn={videoEnabled}
				isVideo
				isFriendCall={matchSource === "friend"}
				chatOpen={chatOpen}
				unreadCount={unreadCount}
				onToggleChat={() => setChatOpen((open) => !open)}
				onToggleMic={toggleAudio}
				onToggleCam={toggleVideo}
				onNext={findNext}
				onReport={() => setReportOpen(true)}
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
				onBlock={blockAndSkip}
			/>
		</section>
	);
}
