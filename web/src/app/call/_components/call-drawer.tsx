"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

interface CallDrawerProps {
	title: string;
	onClose: () => void;
	children: ReactNode;
}

/** 310px slide-over panel anchored to the left edge of the active call. */
export function CallDrawer({ title, onClose, children }: CallDrawerProps) {
	return (
		<aside className="absolute bottom-0 left-0 top-0 z-20 flex w-full max-w-[310px] flex-col border-r border-call-panel bg-call-surface">
			<div className="flex flex-none items-center justify-between border-b border-call-divider px-[18px] py-4">
				<span className="font-heading text-sm font-bold text-white">
					{title}
				</span>
				<button
					type="button"
					onClick={onClose}
					aria-label={`Close ${title}`}
					className="cursor-pointer border-none bg-transparent leading-none text-call-muted"
				>
					<X className="h-[18px] w-[18px]" strokeWidth={1.5} />
				</button>
			</div>
			{children}
		</aside>
	);
}
