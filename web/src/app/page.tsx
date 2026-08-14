import { FEATURE_CARDS, LANDING_STATS } from "@/constants";
import { FeatureCard } from "@/components/blueprint/feature-card";
import { StatItem } from "@/components/blueprint/stat-item";
import { AnimatedBackground } from "@/components/layout/animated-background";
import { AgeGate } from "./_components/age-gate";

export default function HomePage() {
	return (
		<div className="relative flex flex-1 overflow-hidden">
			<AnimatedBackground />

			<section className="relative z-10 mx-auto flex w-full max-w-[960px] flex-1 animate-fade-slide-in flex-col items-center justify-center gap-[22px] px-10 py-16 text-center">
				<div className="font-heading text-[11px] uppercase tracking-[0.14em] text-accent">
					Video chat, reimagined
				</div>
				<h1
					className="m-0 max-w-[680px] leading-[1.05] tracking-[-0.015em]"
					style={{ fontSize: "clamp(36px, 5vw, 58px)" }}
				>
					Every flip,
					<br />a new face.
				</h1>
				<p className="text-muted m-0 max-w-[440px] text-[17px]">
					Spontaneous video calls with real people. No scripts, no profiles —
					just genuine moments.
				</p>

				<AgeGate />

				<div className="mt-1 flex overflow-hidden rounded-md border border-divider bg-surface">
					{LANDING_STATS.map((stat, i) => (
						<div
							key={stat.label}
							className={
								i > 0 ? "border-l border-divider px-5 py-3.5" : "px-5 py-3.5"
							}
						>
							<StatItem value={stat.value} label={stat.label} />
						</div>
					))}
				</div>

				<div className="mt-1.5 grid w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
					{FEATURE_CARDS.map((card) => (
						<FeatureCard key={card.title} {...card} />
					))}
				</div>
			</section>
		</div>
	);
}
