"use client";

import { useEffect } from "react";
import { Phone } from "lucide-react";
import { useFaceFlip } from "@/hooks/use-faceflip";
import { cn, getInitials } from "@/lib/utils";
import { CallDrawer } from "./call-drawer";

interface CallFriendsDrawerProps {
	onClose: () => void;
}

export function CallFriendsDrawer({ onClose }: CallFriendsDrawerProps) {
	const {
		friends,
		incomingRequests,
		outgoingCall,
		acceptRequest,
		rejectRequest,
		callFriend,
		refreshFriends,
	} = useFaceFlip();

	useEffect(() => {
		refreshFriends();
	}, [refreshFriends]);

	const callingId =
		outgoingCall && outgoingCall.status !== "error"
			? outgoingCall.friendUserId
			: null;

	return (
		<CallDrawer title="Flip Friends" onClose={onClose}>
			<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
				{incomingRequests.map((request) => (
					<div
						key={request.id}
						className="flex flex-col gap-2 rounded-md border border-accent/40 bg-accent-100 px-3 py-2.5"
					>
						<span className="font-heading text-[10px] uppercase tracking-[0.06em] text-accent">
							Friend request
						</span>
						<div className="flex items-center gap-2.5">
							<span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-call-panel font-heading text-[11px] text-white">
								{getInitials(request.name ?? "?")}
							</span>
							<div className="min-w-0 flex-1">
								<div className="truncate text-[13px] font-semibold text-white">
									{request.name ?? "Someone"}
								</div>
								<div className="text-[11px] text-call-muted">
									from your last flip
								</div>
							</div>
						</div>
						<div className="flex gap-1.5">
							<button
								type="button"
								onClick={() => acceptRequest(request.id)}
								className="flex-1 cursor-pointer rounded-md border-none bg-accent py-2 font-heading text-[11px] font-bold text-on-accent"
							>
								Accept
							</button>
							<button
								type="button"
								onClick={() => rejectRequest(request.id)}
								className="flex-1 cursor-pointer rounded-md border border-call-panel bg-call-panel py-2 text-[11px] font-semibold text-call-muted"
							>
								Decline
							</button>
						</div>
					</div>
				))}

				{friends.length === 0 && incomingRequests.length === 0 ? (
					<p className="m-auto px-4 text-center text-xs text-call-muted">
						No friends yet — add someone during a flip to connect.
					</p>
				) : (
					friends.map((friend) => (
						<div
							key={friend.userId}
							className="flex items-center gap-2.5 rounded-md bg-call-divider px-3 py-2.5"
						>
							<div className="relative flex-none">
								<span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-call-panel font-heading text-[11px] text-white">
									{getInitials(friend.name)}
								</span>
								<span
									className={cn(
										"absolute bottom-px right-px h-2.5 w-2.5 rounded-full border-2 border-call-divider",
										friend.online ? "bg-green" : "bg-call-muted",
									)}
								/>
							</div>
							<div className="min-w-0 flex-1">
								<div className="truncate text-[13px] font-semibold text-white">
									{friend.name}
								</div>
								<div
									className={cn(
										"mt-px text-[11px]",
										friend.online ? "text-green" : "text-call-muted",
									)}
								>
									{callingId === friend.userId
										? "Calling…"
										: friend.online
											? "Online"
											: "Offline"}
								</div>
							</div>
							<button
								type="button"
								disabled={!friend.online || callingId !== null}
								onClick={() => callFriend(friend.userId)}
								title={friend.online ? "Video call" : "Offline"}
								className="flex h-[30px] w-[30px] flex-none cursor-pointer items-center justify-center rounded-full border-none bg-call-panel disabled:cursor-not-allowed disabled:opacity-40"
							>
								<Phone className="h-[13px] w-[13px] text-green" strokeWidth={2.2} />
							</button>
						</div>
					))
				)}
			</div>
		</CallDrawer>
	);
}
