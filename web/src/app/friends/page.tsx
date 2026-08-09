"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/constants";
import type { Friend, FriendRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";
import { RequestRow } from "./_components/request-row";
import { FriendRow } from "./_components/friend-row";

const INITIAL_FRIENDS: Friend[] = [
	{ id: 1, name: "Ava Chen", initials: "AC", online: true },
	{ id: 2, name: "Marcus Lee", initials: "ML", online: false },
];

const INITIAL_REQUESTS: FriendRequest[] = [
	{ id: 1, name: "Priya Sharma", initials: "PS" },
];

export default function FriendsPage() {
	const router = useRouter();
	const [friends] = useState<Friend[]>(INITIAL_FRIENDS);
	const [requests, setRequests] = useState<FriendRequest[]>(INITIAL_REQUESTS);

	const dismissRequest = (id: number) => {
		setRequests((prev) => prev.filter((request) => request.id !== id));
	};

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

			{requests.length > 0 && (
				<BlueprintFrame className="flex flex-col gap-2.5 p-3.5 shadow-elev-sm">
					<div className="card-kicker">Requests</div>
					{requests.map((request) => (
						<RequestRow
							key={request.id}
							request={request}
							onAccept={() => dismissRequest(request.id)}
							onDecline={() => dismissRequest(request.id)}
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
							onVideo={() => router.push(ROUTES.call)}
							onVoice={() => router.push(ROUTES.call)}
							onChat={() => router.push(ROUTES.chat)}
						/>
					))
				)}
			</BlueprintFrame>
		</section>
	);
}
