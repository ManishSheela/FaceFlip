"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, Settings, UserPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FriendRequestState } from "@/types";

const FRIEND_LABELS: Record<FriendRequestState, string> = {
	sending: "Sending…",
	sent: "Request sent",
	"already-pending": "Request pending",
	"already-friends": "Already friends",
	"auto-accepted": "Friends!",
	accepted: "Friends!",
	error: "Couldn't send",
};

interface CallMenuProps {
	canAddFriend: boolean;
	friendRequestState: FriendRequestState | null;
	onAddFriend: () => void;
	onFriends: () => void;
	onSettings: () => void;
	onExit: () => void;
}

const ITEM_CLASS =
	"flex w-full cursor-pointer items-center gap-2.5 rounded-md border-none bg-transparent px-3 py-2.5 text-left text-xs font-semibold text-white transition-colors hover:bg-white/10";

export function CallMenu({
	canAddFriend,
	friendRequestState,
	onAddFriend,
	onFriends,
	onSettings,
	onExit,
}: CallMenuProps) {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const onPointerDown = (e: PointerEvent) => {
			if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [open]);

	const run = (action: () => void) => {
		setOpen(false);
		action();
	};

	return (
		<div ref={rootRef} className="absolute left-3.5 top-3.5 z-10">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-label="Call menu"
				aria-expanded={open}
				className="flex h-8 w-8 cursor-pointer flex-col items-center justify-center gap-[3px] rounded-full border border-white/10 bg-black/50 backdrop-blur-md"
			>
				<span className="h-[1.5px] w-3.5 rounded-sm bg-white" />
				<span className="h-[1.5px] w-3.5 rounded-sm bg-white" />
				<span className="h-[1.5px] w-3.5 rounded-sm bg-white" />
			</button>

			{open && (
				<div className="absolute left-0 top-[38px] flex min-w-[140px] flex-col gap-0.5 rounded-[12px] border border-white/10 bg-[oklch(0.18_0.02_250)] p-1.5 backdrop-blur-lg">
					{canAddFriend &&
						(friendRequestState ? (
							<span className={cn(ITEM_CLASS, "cursor-default text-call-muted")}>
								<UserPlus className="h-3.5 w-3.5" strokeWidth={2.2} />
								{FRIEND_LABELS[friendRequestState]}
							</span>
						) : (
							<button
								type="button"
								className={ITEM_CLASS}
								onClick={() => run(onAddFriend)}
							>
								<UserPlus className="h-3.5 w-3.5 text-green" strokeWidth={2.2} />
								Add Friend
							</button>
						))}

					<button
						type="button"
						className={ITEM_CLASS}
						onClick={() => run(onFriends)}
					>
						<Users className="h-3.5 w-3.5 text-accent-400" strokeWidth={2.2} />
						Friends
					</button>

					<button
						type="button"
						className={ITEM_CLASS}
						onClick={() => run(onSettings)}
					>
						<Settings className="h-3.5 w-3.5 text-accent-400" strokeWidth={2.2} />
						Settings
					</button>

					<div className="my-0.5 h-px bg-white/[0.08]" />

					<button
						type="button"
						className={cn(ITEM_CLASS, "text-red")}
						onClick={() => run(onExit)}
					>
						<LogOut className="h-3.5 w-3.5 text-red" strokeWidth={2.2} />
						Exit
					</button>
				</div>
			)}
		</div>
	);
}
