import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  text: string;
  isMe: boolean;
  /** Sender initials, shown beside received messages. */
  senderInitials?: string;
}

export function MessageBubble({ text, isMe, senderInitials }: MessageBubbleProps) {
  if (isMe) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] bg-accent px-3 py-2 text-sm leading-[1.45] text-on-accent">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-start gap-2">
      <div className="flex h-[26px] w-[26px] flex-none items-center justify-center border border-divider bg-accent-100 font-heading text-[9px] text-accent-800">
        {senderInitials}
      </div>
      <div className="max-w-[70%] border border-divider bg-surface px-3 py-2 text-sm leading-[1.45] text-text">
        {text}
      </div>
    </div>
  );
}
