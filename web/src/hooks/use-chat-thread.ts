"use client";

import { useEffect, useRef, useState } from "react";
import { CHAT_AUTO_REPLIES, CHAT_REPLY_DELAY_MS } from "@/constants";
import type { ChatMessage, Friend } from "@/types";

function seedThread(friend: Friend): ChatMessage[] {
	const firstName = friend.name.split(" ")[0];
	return [
		{ id: 1, text: "Hey! Good to see you here.", isMe: false },
		{ id: 2, text: `Hey ${firstName}! Great connecting.`, isMe: true },
		{ id: 3, text: "Want to hop on a call sometime?", isMe: false },
	];
}

export function useChatThread(friend: Friend | null) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		setMessages(friend ? seedThread(friend) : []);
		setInput("");
		return () => {
			if (replyTimer.current) clearTimeout(replyTimer.current);
		};
	}, [friend]);

	const send = () => {
		const text = input.trim();
		if (!text) return;
		setMessages((prev) => [...prev, { id: Date.now(), text, isMe: true }]);
		setInput("");

		replyTimer.current = setTimeout(() => {
			const reply =
				CHAT_AUTO_REPLIES[Math.floor(Math.random() * CHAT_AUTO_REPLIES.length)];
			setMessages((prev) => [
				...prev,
				{ id: Date.now() + 1, text: reply, isMe: false },
			]);
		}, CHAT_REPLY_DELAY_MS);
	};

	return { messages, input, setInput, send };
}
