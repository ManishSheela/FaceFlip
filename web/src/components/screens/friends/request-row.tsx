"use client";

import type { FriendRequest } from "@/types";
import { Avatar } from "@/components/blueprint/avatar";
import { Button } from "@/components/ui/button";

interface RequestRowProps {
  request: FriendRequest;
  onAccept: () => void;
  onDecline: () => void;
}

export function RequestRow({ request, onAccept, onDecline }: RequestRowProps) {
  return (
    <div className="flex items-center gap-2.5 border-b border-divider py-1.5 last:border-b-0">
      <Avatar initials={request.initials} size={40} />
      <div className="flex-1">
        <div className="font-semibold">{request.name}</div>
        <div className="text-muted text-xs">Wants to connect</div>
      </div>
      <div className="flex gap-1.5">
        <Button variant="primary" size="sm" onClick={onAccept}>
          Accept
        </Button>
        <Button variant="secondary" size="sm" onClick={onDecline}>
          Decline
        </Button>
      </div>
    </div>
  );
}
