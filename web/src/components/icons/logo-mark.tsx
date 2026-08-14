interface LogoMarkProps {
	size?: number;
	className?: string;
}

/** The FaceFliip aperture mark: a focus dot framed by four edge ticks. */
export function LogoMark({ size = 16, className }: LogoMarkProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			strokeLinecap="round"
			className={className}
			aria-hidden
		>
			<circle cx="12" cy="12" r="4" />
			<line x1="12" y1="2" x2="12" y2="5" />
			<line x1="12" y1="19" x2="12" y2="22" />
			<line x1="2" y1="12" x2="5" y2="12" />
			<line x1="19" y1="12" x2="22" y2="12" />
		</svg>
	);
}
