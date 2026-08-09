"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { MAX_CHAT_LENGTH, TYPING_IDLE_MS } from "@/constants";
import type { StrangerMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "@/app/chat/_components/message-bubble";

interface StrangerChatPanelProps {
	messages: StrangerMessage[];
	partnerTyping: boolean;
	partnerInitials: string;
	onSend: (text: string) => void;
	onTyping: (isTyping: boolean) => void;
	onClose: () => void;
}

export function StrangerChatPanel({
	messages,
	partnerTyping,
	partnerInitials,
	onSend,
	onTyping,
	onClose,
}: StrangerChatPanelProps) {
	const [input, setInput] = useState("");
	const endRef = useRef<HTMLDivElement>(null);
	const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, partnerTyping]);

	useEffect(() => {
		return () => {
			if (typingTimer.current) clearTimeout(typingTimer.current);
		};
	}, []);

	const stopTyping = () => {
		if (typingTimer.current) clearTimeout(typingTimer.current);
		typingTimer.current = null;
		onTyping(false);
	};

	const handleChange = (value: string) => {
		setInput(value);

		if (!value.trim()) {
			stopTyping();
			return;
		}

		onTyping(true);
		if (typingTimer.current) clearTimeout(typingTimer.current);
		typingTimer.current = setTimeout(() => onTyping(false), TYPING_IDLE_MS);
	};

	const submit = () => {
		const text = input.trim();
		if (!text) return;

		onSend(text);
		setInput("");
		stopTyping();
	};

	return (
		<aside className="pointer-events-auto absolute bottom-0 right-0 top-0 z-20 flex w-full flex-col border-l border-divider bg-bg/95 backdrop-blur-sm sm:w-[320px]">
			<div className="flex flex-none items-center justify-between border-b border-divider px-3.5 py-2.5">
				<span className="text-[13px] font-medium">Chat</span>
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					title="Close chat"
					aria-label="Close chat"
				>
					<X className="h-4 w-4" strokeWidth={1.5} />
				</Button>
			</div>

			<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3.5">
				{messages.length === 0 && !partnerTyping && (
					<p className="text-muted m-auto text-center text-xs">
						Say hello — messages disappear when the call ends.
					</p>
				)}

				{messages.map((message) => (
					<MessageBubble
						key={message.id}
						text={message.text}
						isMe={message.fromSelf}
						senderInitials={partnerInitials}
					/>
				))}

				{partnerTyping && (
					<span className="text-muted text-xs italic">Stranger is typing…</span>
				)}
				<div ref={endRef} />
			</div>

			<form
				className="flex flex-none gap-1.5 border-t border-divider px-3.5 py-2.5"
				onSubmit={(event) => {
					event.preventDefault();
					submit();
				}}
			>
				<Input
					value={input}
					onChange={(event) => handleChange(event.target.value)}
					onBlur={stopTyping}
					placeholder="Type a message…"
					maxLength={MAX_CHAT_LENGTH}
					className="flex-1"
				/>
				<Button
					type="submit"
					variant="primary"
					blueprint
					disabled={!input.trim()}
				>
					Send
				</Button>
			</form>
		</aside>
	);
}
