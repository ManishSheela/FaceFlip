"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { getInitials } from "@/lib/utils";
import { EndCallDialog } from "@/components/dialogs/end-call-dialog";
import { ReportDialog } from "@/components/dialogs/report-dialog";
import { VideoCallPanels } from "./_components/video-call-panels";
import { CallControlBar } from "./_components/call-control-bar";
import { StrangerChatPanel } from "./_components/stranger-chat-panel";
import type { StrangerMessage } from "@/types";

export default function CallPage() {
	const router = useRouter();

	const [micOn, setMicOn] = useState(true);
	const [camOn, setCamOn] = useState(true);
	const [endOpen, setEndOpen] = useState(false);
	const [reportOpen, setReportOpen] = useState(false);
	const [chatOpen, setChatOpen] = useState(false);
	const [messages, setMessages] = useState<StrangerMessage[]>([]);

	const sendMessage = (text: string) => {
		setMessages((prev) => [
			...prev,
			{ id: `self-${Date.now()}`, text, timestamp: Date.now(), fromSelf: true },
		]);
	};

	return (
		<section className="relative flex min-h-[520px] flex-1 animate-fade-slide-in flex-col overflow-hidden sm:flex-row">
			<VideoCallPanels
				targetName="Stranger"
				targetGender="random"
				connected
				timeLabel="00:00"
				camOn={camOn}
				localStream={null}
				remoteStream={null}
				partnerMedia={{ audio: true, video: true }}
			/>

			{chatOpen && (
				<StrangerChatPanel
					messages={messages}
					partnerTyping={false}
					partnerInitials={getInitials("Stranger")}
					onSend={sendMessage}
					onTyping={() => {}}
					onClose={() => setChatOpen(false)}
				/>
			)}

			<CallControlBar
				micOn={micOn}
				camOn={camOn}
				isVideo
				isFriendCall={false}
				chatOpen={chatOpen}
				unreadCount={0}
				onToggleChat={() => setChatOpen((open) => !open)}
				onToggleMic={() => setMicOn((v) => !v)}
				onToggleCam={() => setCamOn((v) => !v)}
				onNext={() => router.push(ROUTES.matching)}
				onAddFriend={() => {}}
				onEnd={() => setEndOpen(true)}
				onReport={() => setReportOpen(true)}
				onSettings={() => router.push(`${ROUTES.settings}?from=call`)}
			/>

			<EndCallDialog
				open={endOpen}
				onOpenChange={setEndOpen}
				onConfirm={() => {
					setEndOpen(false);
					router.push(`${ROUTES.postcall}?d=0`);
				}}
			/>
			<ReportDialog open={reportOpen} onOpenChange={setReportOpen} />
		</section>
	);
}
