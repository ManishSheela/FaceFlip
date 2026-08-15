const CORNERS = [
	{ pos: "left-0 top-0", border: "border-l border-t" },
	{ pos: "right-0 top-0", border: "border-r border-t" },
	{ pos: "left-0 bottom-0", border: "border-l border-b" },
	{ pos: "right-0 bottom-0", border: "border-r border-b" },
] as const;

interface CornerBracketsProps {
	/** Bracket arm length in px. */
	size?: number;
	color?: string;
}

/**
 * Four L-shaped corner marks over a `relative` parent — the sharp-edged
 * "technical schematic" accent used on the premium purchase flow.
 */
export function CornerBrackets({ size = 8, color = "var(--color-accent)" }: CornerBracketsProps) {
	return (
		<>
			{CORNERS.map(({ pos, border }) => (
				<span
					key={pos}
					aria-hidden
					className={`pointer-events-none absolute ${pos} ${border}`}
					style={{ width: size, height: size, borderColor: color }}
				/>
			))}
		</>
	);
}
