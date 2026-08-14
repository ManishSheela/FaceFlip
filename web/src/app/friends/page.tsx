"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Trash2, Video } from "lucide-react";
import { ROUTES } from "@/constants";
import { useFaceFlip } from "@/hooks/use-faceflip";
import { useSession } from "@/hooks/use-session";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/blueprint/avatar";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";
import { Tag } from "@/components/blueprint/tag";

export default function FriendsPage() {
	const { isAuthenticated } = useSession();
	const {
		friends,
		incomingRequests,
		outgoingCall,
		acceptRequest,
		rejectRequest,
		removeFriend,
		callFriend,
		refreshFriends,
	} = useFaceFlip();

	useEffect(() => {
		refreshFriends();
	}, [refreshFriends]);

	if (!isAuthenticated) {
		return (
			<section className="mx-auto flex w-full max-w-[680px] animate-fade-slide-in flex-col gap-[17px] px-3.5 pb-10 pt-5">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<h2 className="m-0">Friends</h2>
					<Button asChild variant="ghost">
						<Link href={ROUTES.landing}>
							<ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
							Home
						</Link>
					</Button>
				</div>
				<BlueprintFrame className="flex flex-col items-center gap-3.5 p-5 text-center shadow-elev-sm">
					<p className="text-muted m-0 text-sm">
						Sign in to add friends and call them directly.
					</p>
					<Button asChild variant="primary">
						<Link href={ROUTES.auth}>Sign in</Link>
					</Button>
				</BlueprintFrame>
			</section>
		);
	}

	const callingId =
		outgoingCall && outgoingCall.status !== "error"
			? outgoingCall.friendUserId
			: null;

	return (
		<section className="mx-auto flex w-full max-w-[680px] animate-fade-slide-in flex-col gap-[17px] px-3.5 pb-10 pt-5">
			<div className="flex items-center justify-between">
				<h2 className="m-0">Friends</h2>
				<Button asChild variant="ghost">
					<Link href={ROUTES.landing}>
						<ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
						Home
					</Link>
				</Button>
			</div>

			{incomingRequests.length > 0 && (
				<BlueprintFrame className="flex flex-col gap-2.5 p-3.5 shadow-elev-sm">
					<div className="card-kicker">Requests</div>
					{incomingRequests.map((request) => (
						<div
							key={request.id}
							className="flex items-center gap-2.5 border-b border-divider py-1.5 last:border-b-0"
						>
							<Avatar initials={getInitials(request.name ?? "?")} size={40} />
							<div className="flex-1">
								<div className="font-semibold">{request.name ?? "Someone"}</div>
								<div className="text-muted text-xs">Wants to connect</div>
							</div>
							<div className="flex gap-1.5">
								<Button
									variant="primary"
									size="sm"
									onClick={() => acceptRequest(request.id)}
								>
									Accept
								</Button>
								<Button
									variant="secondary"
									size="sm"
									onClick={() => rejectRequest(request.id)}
								>
									Decline
								</Button>
							</div>
						</div>
					))}
				</BlueprintFrame>
			)}

			<BlueprintFrame className="flex flex-col gap-1.5 p-3.5 shadow-elev-sm">
				<div className="card-kicker mb-1.5">Your friends</div>
				{friends.length === 0 ? (
					<p className="text-muted m-0 py-5 text-center">
						No friends yet — add someone during a call to connect!
					</p>
				) : (
					friends.map((friend) => (
						<div
							key={friend.userId}
							className="flex items-center gap-2.5 border-b border-divider py-2.5 last:border-b-0"
						>
							<Avatar
								initials={getInitials(friend.name)}
								size={42}
								online={friend.online}
							/>
							<div className="min-w-0 flex-1">
								<div className="truncate font-semibold">{friend.name}</div>
								<div className="text-muted text-xs">
									{friend.online ? "Online" : "Offline"}
								</div>
							</div>
							<div className="flex items-center gap-1.5">
								{callingId === friend.userId && (
									<Tag variant="accent" className="text-[11px]">
										Calling…
									</Tag>
								)}
								<Button
									variant="secondary"
									size="icon"
									disabled={!friend.online || callingId !== null}
									onClick={() => callFriend(friend.userId)}
									title={friend.online ? "Video call" : "Offline"}
								>
									<Video className="h-3.5 w-3.5" strokeWidth={1.5} />
								</Button>
								<Button
									variant="secondary"
									size="icon"
									onClick={() => removeFriend(friend.userId)}
									title="Remove friend"
								>
									<Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
								</Button>
							</div>
						</div>
					))
				)}
			</BlueprintFrame>
		</section>
	);
}
