"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Phone, Send, Video } from "lucide-react";
import { ROUTES } from "@/constants";
import type { ChatMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/blueprint/avatar";
import { MessageBubble } from "./_components/message-bubble";

const DEMO_FRIEND = { name: "Ava Chen", initials: "AC" };

const INITIAL_MESSAGES: ChatMessage[] = [
	{ id: 1, text: "Hey! Good to see you here.", isMe: false },
	{ id: 2, text: "Hey Ava! Great connecting.", isMe: true },
	{ id: 3, text: "Want to hop on a call sometime?", isMe: false },
];

export default function ChatPage() {
	const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
	const [input, setInput] = useState("");
	const endRef = useRef<HTMLDivElement>(null);

	const send = () => {
		const text = input.trim();
		if (!text) return;
		setMessages((prev) => [...prev, { id: Date.now(), text, isMe: true }]);
		setInput("");
	};

	return (
		<section className="mx-auto flex w-full max-w-[680px] flex-1 animate-fade-slide-in flex-col">
			<div className="flex flex-none items-center gap-2.5 border-b border-divider bg-bg px-3.5 py-2.5">
				<Button asChild variant="ghost" className="px-0">
					<Link href={ROUTES.friends}>
						<ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
						Friends
					</Link>
				</Button>
				<div className="h-[18px] w-px bg-divider" />
				<Avatar initials={DEMO_FRIEND.initials} size={34} />
				<div className="flex-1">
					<div className="text-[15px] font-semibold">{DEMO_FRIEND.name}</div>
					<div className="text-muted text-[11px]">Online</div>
				</div>
				<div className="flex gap-1.5">
					<Button asChild variant="secondary" size="icon" title="Video call">
						<Link href={ROUTES.call}>
							<Video className="h-3.5 w-3.5" strokeWidth={1.5} />
						</Link>
					</Button>
					<Button asChild variant="secondary" size="icon" title="Voice call">
						<Link href={ROUTES.call}>
							<Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
						</Link>
					</Button>
				</div>
			</div>
			<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3.5">
				{messages.map((message) => (
					<MessageBubble
						key={message.id}
						text={message.text}
						isMe={message.isMe}
						senderInitials={DEMO_FRIEND.initials}
					/>
				))}
				<div ref={endRef} />
			</div>
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
