/**
 * The three-layer light-shell backdrop: a drifting hairline grid, a breathing
 * radial glow, and orbiting colour blobs. Never used on the dark call screens.
 */
export function AnimatedBackground() {
	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			<div className="grid-overlay absolute animate-grid-drift" />
			<div className="hero-glow absolute inset-0 animate-hero-glow" />
			<div className="absolute left-1/2 top-1/2 h-0 w-0">
				<div className="hero-blob-1 absolute origin-top-left animate-orbit-1 rounded-full" />
				<div className="hero-blob-2 absolute origin-top-left animate-orbit-2 rounded-full" />
				<div className="hero-blob-3 absolute origin-top-left animate-orbit-3 rounded-full" />
			</div>
		</div>
	);
}
