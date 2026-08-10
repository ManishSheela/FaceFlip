"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PhoneCall, PhoneOff } from "lucide-react";
import { CHROMELESS_ROUTES, ROUTES } from "@/constants";
import { useFaceFlip } from "@/hooks/use-faceflip";
import { Button } from "@/components/ui/button";

const OUTGOING_LABELS: Record<string, string> = {
	calling: "Calling…",
	ringing: "Ringing…",
	rejected: "Call declined",
	error: "Couldn't start the call",
};

export function CallBanner() {
	const router = useRouter();
	const pathname = usePathname();
	const {
		status,
		incomingCall,
		outgoingCall,
		acceptIncomingCall,
		rejectIncomingCall,
		cancelCall,
	} = useFaceFlip();

	const wasActiveRef = useRef(false);

	useEffect(() => {
		const active = status === "matched" || status === "connected";
		const wasActive = wasActiveRef.current;
		wasActiveRef.current = active;

		if (!active || wasActive) return;
		if (pathname !== ROUTES.call) router.push(ROUTES.call);
	}, [status, pathname, router]);

	if (CHROMELESS_ROUTES.includes(pathname)) return null;
	if (!incomingCall && !outgoingCall) return null;

	if (incomingCall) {
		return (
			<div className="flex flex-wrap items-center justify-center gap-3.5 border-b border-divider bg-accent px-3.5 py-2.5 text-on-accent">
				<PhoneCall className="h-4 w-4" strokeWidth={1.5} />
				<span className="text-sm font-medium">
					{incomingCall.name ?? "A friend"} is calling
				</span>
				<div className="flex gap-1.5">
					<Button
						variant="secondary"
						size="sm"
						onClick={() => void acceptIncomingCall()}
					>
						Accept
					</Button>
					<Button variant="danger" size="sm" onClick={rejectIncomingCall}>
						Decline
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-wrap items-center justify-center gap-3.5 border-b border-divider bg-surface px-3.5 py-2.5">
			<PhoneOff className="h-4 w-4 text-muted" strokeWidth={1.5} />
			<span className="text-sm">
				{outgoingCall?.reason ??
					OUTGOING_LABELS[outgoingCall?.status ?? "calling"]}
			</span>
			{(outgoingCall?.status === "calling" ||
				outgoingCall?.status === "ringing") && (
				<Button variant="secondary" size="sm" onClick={cancelCall}>
					Cancel
				</Button>
			)}
		</div>
	);
}
