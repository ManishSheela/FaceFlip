"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CONNECT_DELAY_MS, ROUTES } from "@/constants";
import { useCall } from "@/hooks/use-call";
import { useFriends } from "@/hooks/use-friends";
import { useElapsedTimer } from "@/hooks/use-elapsed-timer";
import { useTimeout } from "@/hooks/use-timeout";
import { formatDuration } from "@/lib/utils";
import { EndCallDialog } from "@/components/dialogs/end-call-dialog";
import { ReportDialog } from "@/components/dialogs/report-dialog";
import { VideoCallPanels } from "./_components/video-call-panels";
import { VoiceCallOverlay } from "./_components/voice-call-overlay";
import { CallControlBar } from "./_components/call-control-bar";

export default function CallPage() {
	const router = useRouter();
	const { activeFriend, callType } = useCall();
	const { addRandomFriend } = useFriends();

	const isVideo = callType !== "voice";
	const isFriendCall = activeFriend !== null;
	const targetName = activeFriend?.name ?? "Stranger";

	const [micOn, setMicOn] = useState(true);
	const [camOn, setCamOn] = useState(isVideo);
	const [connected, setConnected] = useState(false);
	const [endOpen, setEndOpen] = useState(false);
	const [reportOpen, setReportOpen] = useState(false);

	const elapsed = useElapsedTimer();
	const timeLabel = formatDuration(elapsed);

	useTimeout(() => setConnected(true), connected ? null : CONNECT_DELAY_MS);

	const endCall = () => {
		setEndOpen(false);
		router.push(`${ROUTES.postcall}?d=${elapsed}`);
	};

	return (
		<section className="relative flex min-h-[520px] flex-1 animate-fade-slide-in flex-col overflow-hidden sm:flex-row">
			{isVideo ? (
				<VideoCallPanels
					targetName={targetName}
					connected={connected}
					timeLabel={timeLabel}
					camOn={camOn}
				/>
			) : (
				<VoiceCallOverlay
					initials={activeFriend?.initials ?? "??"}
					targetName={targetName}
					timeLabel={timeLabel}
				/>
			)}

			<CallControlBar
				micOn={micOn}
				camOn={camOn}
				isVideo={isVideo}
				isFriendCall={isFriendCall}
				onToggleMic={() => setMicOn((v) => !v)}
				onToggleCam={() => setCamOn((v) => !v)}
				onNext={() => router.push(ROUTES.matching)}
				onAddFriend={addRandomFriend}
				onEnd={() => setEndOpen(true)}
				onReport={() => setReportOpen(true)}
				onSettings={() => router.push(`${ROUTES.settings}?from=call`)}
			/>

			<EndCallDialog
				open={endOpen}
				onOpenChange={setEndOpen}
				onConfirm={endCall}
			/>
			<ReportDialog open={reportOpen} onOpenChange={setReportOpen} />
		</section>
	);
}
