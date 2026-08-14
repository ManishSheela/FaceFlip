import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "./animated-background";

interface CenteredScreenProps {
	children: ReactNode;
	maxWidth?: number;
	className?: string;
	/** Render the shared light-shell grid-overlay texture behind the content. */
	background?: boolean;
}

export function CenteredScreen({
	children,
	maxWidth = 440,
	className,
	background = false,
}: CenteredScreenProps) {
	return (
		<div className="relative flex flex-1 overflow-hidden">
			{background && <AnimatedBackground />}
			<section
				className={cn(
					"relative z-10 mx-auto w-full animate-fade-slide-in px-3.5 py-5",
					"flex flex-1 flex-col justify-center",
					className,
				)}
				style={{ maxWidth }}
			>
				{children}
			</section>
		</div>
	);
}
