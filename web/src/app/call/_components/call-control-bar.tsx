"use client";

import {
  Flag,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  SkipForward,
  UserPlus,
  Video,
  VideoOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/blueprint/tag";

interface CallControlBarProps {
  micOn: boolean;
  camOn: boolean;
  isVideo: boolean;
  isFriendCall: boolean;
  chatOpen?: boolean;
  unreadCount?: number;
  onToggleChat?: () => void;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onNext: () => void;
  onAddFriend: () => void;
  onEnd: () => void;
  onReport: () => void;
  onSettings: () => void;
}

const ICON_PROPS = { className: "h-[17px] w-[17px]", strokeWidth: 1.5 } as const;

/** The floating call controls anchored to the bottom of the call screen. */
export function CallControlBar({
  micOn,
  camOn,
  isVideo,
  isFriendCall,
  chatOpen,
  unreadCount = 0,
  onToggleChat,
  onToggleMic,
  onToggleCam,
  onNext,
  onAddFriend,
  onEnd,
  onReport,
  onSettings,
}: CallControlBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-wrap justify-center gap-2.5 bg-gradient-to-t from-black/60 to-transparent p-3.5">
      <Button
        variant={micOn ? "glass" : "primary"}
        size="icon"
        onClick={onToggleMic}
        title={micOn ? "Mute" : "Unmute"}
      >
        {micOn ? <Mic {...ICON_PROPS} /> : <MicOff {...ICON_PROPS} />}
      </Button>

      {isVideo && (
        <Button
          variant={camOn ? "glass" : "primary"}
          size="icon"
          onClick={onToggleCam}
          title={camOn ? "Camera off" : "Camera on"}
        >
          {camOn ? <Video {...ICON_PROPS} /> : <VideoOff {...ICON_PROPS} />}
        </Button>
      )}

      {!isFriendCall && (
        <Button variant="primary" blueprint className="gap-1.5" onClick={onNext}>
          <SkipForward className="h-4 w-4" strokeWidth={1.5} />
          Next
        </Button>
      )}

      {onToggleChat && (
        <Button
          variant={chatOpen ? "primary" : "glass"}
          size="icon"
          onClick={onToggleChat}
          title={chatOpen ? "Hide chat" : "Show chat"}
          className="relative"
        >
          <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
          {unreadCount > 0 && !chatOpen && (
            <Tag
              variant="accent"
              className="absolute -right-1.5 -top-1.5 px-1 py-0 text-[10px]"
            >
              {unreadCount}
            </Tag>
          )}
        </Button>
      )}

      {!isFriendCall && (
        <Button
          variant="glass"
          size="icon"
          onClick={onAddFriend}
          title="Add as friend"
        >
          <UserPlus className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      )}

      <Button variant="danger" size="icon" onClick={onEnd} title="End call">
        <PhoneOff {...ICON_PROPS} />
      </Button>

      <Button variant="glass" size="icon" onClick={onReport} title="Report">
        <Flag className="h-4 w-4" strokeWidth={1.5} />
      </Button>

      <Button variant="glass" size="icon" onClick={onSettings} title="Settings">
        <Settings className="h-4 w-4" strokeWidth={1.5} />
      </Button>
    </div>
  );
}
