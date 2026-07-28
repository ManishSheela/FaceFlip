"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/constants";
import { useAppState } from "@/hooks/use-app-state";
import type { CallType, Friend } from "@/types";
import { Button } from "@/components/ui/button";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";
import { RequestRow } from "@/components/screens/friends/request-row";
import { FriendRow } from "@/components/screens/friends/friend-row";

export function FriendsScreen() {
	const router = useRouter();
	const {
		friends,
		requests,
		acceptRequest,
		declineRequest,
		startFriendCall,
		setActiveFriend,
	} = useAppState();

	const callFriend = (friend: Friend, type: CallType) => {
		startFriendCall(friend, type);
		router.push(ROUTES.call);
	};

	const openChat = (friend: Friend) => {
		setActiveFriend(friend);
		router.push(ROUTES.chat);
	};

	return (
		<section className="mx-auto flex w-full max-w-[680px] animate-fade-slide-in flex-col gap-[17px] px-3.5 pb-10 pt-5">
			<div className="flex items-center justify-between">
				<h2 className="m-0">Friends</h2>
				<Button variant="ghost" onClick={() => router.push(ROUTES.landing)}>
					<ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
					Home
				</Button>
			</div>

			{requests.length > 0 && (
				<BlueprintFrame className="flex flex-col gap-2.5 p-3.5 shadow-elev-sm">
					<div className="card-kicker">Requests</div>
					{requests.map((request) => (
						<RequestRow
							key={request.id}
							request={request}
							onAccept={() => acceptRequest(request.id)}
							onDecline={() => declineRequest(request.id)}
						/>
					))}
				</BlueprintFrame>
			)}

			<BlueprintFrame className="flex flex-col gap-1.5 p-3.5 shadow-elev-sm">
				<div className="card-kicker mb-1.5">Your friends</div>
				{friends.length === 0 ? (
					<p className="text-muted m-0 py-5 text-center">
						No friends yet — start chatting to connect!
					</p>
				) : (
					friends.map((friend) => (
						<FriendRow
							key={friend.id}
							friend={friend}
							onVideo={() => callFriend(friend, "video")}
							onVoice={() => callFriend(friend, "voice")}
							onChat={() => openChat(friend)}
						/>
					))
				)}
			</BlueprintFrame>
		</section>
	);
}
