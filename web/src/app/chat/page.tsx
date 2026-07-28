"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Phone, Send, Video } from "lucide-react";
import { ROUTES } from "@/constants";
import { useAppState } from "@/hooks/use-app-state";
import { useChatThread } from "@/hooks/use-chat-thread";
import type { CallType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/blueprint/avatar";
import { MessageBubble } from "@/components/screens/chat/message-bubble";

export function ChatScreen() {
	const router = useRouter();
	const { activeFriend, startFriendCall } = useAppState();
	const { messages, input, setInput, send } = useChatThread(activeFriend);
	const endRef = useRef<HTMLDivElement>(null);

	// Guard: a chat needs a selected friend.
	useEffect(() => {
		if (!activeFriend) router.replace(ROUTES.friends);
	}, [activeFriend, router]);

	// Keep the newest message in view.
	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (!activeFriend) return null;

	const call = (type: CallType) => {
		startFriendCall(activeFriend, type);
		router.push(ROUTES.call);
	};

	return (
		<section className="mx-auto flex w-full max-w-[680px] flex-1 animate-fade-slide-in flex-col">
			{/* Header */}
			<div className="flex flex-none items-center gap-2.5 border-b border-divider bg-bg px-3.5 py-2.5">
				<Button
					variant="ghost"
					className="px-0"
					onClick={() => router.push(ROUTES.friends)}
				>
					<ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
					Friends
				</Button>
				<div className="h-[18px] w-px bg-divider" />
				<Avatar initials={activeFriend.initials} size={34} />
				<div className="flex-1">
					<div className="text-[15px] font-semibold">{activeFriend.name}</div>
					<div className="text-muted text-[11px]">Online</div>
				</div>
				<div className="flex gap-1.5">
					<Button
						variant="secondary"
						size="icon"
						onClick={() => call("video")}
						title="Video call"
					>
						<Video className="h-3.5 w-3.5" strokeWidth={1.5} />
					</Button>
					<Button
						variant="secondary"
						size="icon"
						onClick={() => call("voice")}
						title="Voice call"
					>
						<Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
					</Button>
				</div>
			</div>

			{/* Messages */}
			<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3.5">
				{messages.map((message) => (
					<MessageBubble
						key={message.id}
						text={message.text}
						isMe={message.isMe}
						senderInitials={activeFriend.initials}
					/>
				))}
				<div ref={endRef} />
			</div>

			{/* Input */}
			<form
				className="flex flex-none gap-1.5 border-t border-divider bg-bg px-3.5 py-2.5"
				onSubmit={(e) => {
					e.preventDefault();
					send();
				}}
			>
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type a message…"
					className="flex-1"
				/>
				<Button type="submit" variant="primary">
					<Send className="h-4 w-4" strokeWidth={1.5} />
					Send
				</Button>
			</form>
		</section>
	);
}
