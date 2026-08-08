"use client";

import { MessageSquare, Phone, Video } from "lucide-react";
import type { Friend } from "@/types";
import { Avatar } from "@/components/blueprint/avatar";
import { Button } from "@/components/ui/button";

interface FriendRowProps {
  friend: Friend;
  onVideo: () => void;
  onVoice: () => void;
  onChat: () => void;
}

export function FriendRow({ friend, onVideo, onVoice, onChat }: FriendRowProps) {
  return (
    <div className="flex items-center gap-2.5 border-b border-divider py-2.5 last:border-b-0">
      <Avatar initials={friend.initials} size={42} online={friend.online} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{friend.name}</div>
        <div className="text-muted text-xs">
          {friend.online ? "Online" : "Offline"}
        </div>
      </div>
      <div className="flex gap-1.5">
        <Button variant="secondary" size="icon" onClick={onVideo} title="Video call">
          <Video className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Button>
        <Button variant="secondary" size="icon" onClick={onVoice} title="Voice call">
          <Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Button>
        <Button variant="secondary" size="icon" onClick={onChat} title="Message">
          <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
}
