import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CenteredScreenProps {
	children: ReactNode;
	maxWidth?: number;
	className?: string;
}

export function CenteredScreen({
	children,
	maxWidth = 440,
	className,
}: CenteredScreenProps) {
	return (
		<section
			className={cn(
				"mx-auto w-full animate-fade-slide-in px-3.5 py-5",
				"flex flex-1 flex-col justify-center",
				className,
			)}
			style={{ maxWidth }}
		>
			{children}
		</section>
	);
}
