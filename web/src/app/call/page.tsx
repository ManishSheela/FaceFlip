"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { useCall } from "@/hooks/use-call";
import { useFriends } from "@/hooks/use-friends";
import { useElapsedTimer } from "@/hooks/use-elapsed-timer";
import { useTimeout } from "@/hooks/use-timeout";
import { formatDuration } from "@/lib/utils";
import { EndCallDialog } from "@/components/dialogs/end-call-dialog";
import { ReportDialog } from "@/components/dialogs/report-dialog";
import { VideoCallPanels } from "@/components/screens/call/video-call-panels";
import { VoiceCallOverlay } from "@/components/screens/call/voice-call-overlay";
import { CallControlBar } from "@/components/screens/call/call-control-bar";

export function CallScreen() {
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

	const elapsed = useElapsedTimer(true);
	const timeLabel = formatDuration(elapsed);

	// Simulated handshake: flip to "Connected" shortly after joining.
	useTimeout(() => setConnected(true), connected ? null : 1000);

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
