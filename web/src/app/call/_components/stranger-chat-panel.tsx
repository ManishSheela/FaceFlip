"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { MAX_CHAT_LENGTH, TYPING_IDLE_MS } from "@/constants";
import { cn } from "@/lib/utils";
import type { StrangerMessage } from "@/types";

interface StrangerChatPanelProps {
	messages: StrangerMessage[];
	partnerTyping: boolean;
	onSend: (text: string) => void;
	onTyping: (isTyping: boolean) => void;
}

export function StrangerChatPanel({
	messages,
	partnerTyping,
	onSend,
	onTyping,
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
		<aside className="pointer-events-auto absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-2 border-t border-white/[0.08] bg-black/55 p-3.5 backdrop-blur-[10px] sm:left-1/2">
			<div className="flex h-40 flex-col gap-1.5 overflow-y-auto pr-1">
				{messages.length === 0 && !partnerTyping && (
					<p className="m-auto text-center text-xs text-call-muted">
						Say hello — messages disappear when the call ends.
					</p>
				)}

				{messages.map((message) => (
					<div
						key={message.id}
						className={cn(
							"flex items-end gap-2",
							message.fromSelf ? "justify-end" : "justify-start",
						)}
					>
						{!message.fromSelf && (
							<span className="flex-none font-heading text-[10px] tracking-[0.04em] text-[oklch(0.65_0.18_250)]">
								THEM
							</span>
						)}
						<div
							className={cn(
								"max-w-[200px] px-2.5 py-1.5 text-xs leading-[1.45] text-white",
								message.fromSelf
									? "rounded-[12px_12px_2px_12px] bg-accent-2"
									: "rounded-[12px_12px_12px_2px] bg-call-panel",
							)}
						>
							{message.text}
						</div>
						{message.fromSelf && (
							<span className="flex-none font-heading text-[10px] tracking-[0.04em] text-[oklch(0.75_0.14_330)]">
								YOU
							</span>
						)}
					</div>
				))}

				{partnerTyping && (
					<span className="text-xs italic text-call-muted">
						Stranger is typing…
					</span>
				)}
				<div ref={endRef} />
			</div>

			<form
				className="flex flex-none items-center gap-2"
				onSubmit={(event) => {
					event.preventDefault();
					submit();
				}}
			>
				<input
					value={input}
					onChange={(event) => handleChange(event.target.value)}
					onBlur={stopTyping}
					placeholder="Type a message…"
					maxLength={MAX_CHAT_LENGTH}
					className="min-w-0 flex-1 rounded-full border border-white/[0.12] bg-white/[0.08] px-3.5 py-2 text-xs text-white outline-none placeholder:text-call-muted focus-visible:border-accent"
				/>
				<button
					type="submit"
					disabled={!input.trim()}
					aria-label="Send message"
					className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full border-none bg-accent disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Send className="h-3.5 w-3.5 text-on-accent" strokeWidth={2.2} />
				</button>
			</form>
		</aside>
	);
}
