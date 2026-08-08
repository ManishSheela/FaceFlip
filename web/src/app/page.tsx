import { FEATURE_CARDS } from "@/constants";
import { FeatureCard } from "@/components/blueprint/feature-card";
import { AgeGate } from "./_components/age-gate";

export default function HomePage() {
	return (
		<section className="mx-auto flex w-full max-w-[960px] flex-1 animate-fade-slide-in flex-col items-center justify-center gap-5 px-6 py-16 text-center">
			<h1
				className="m-0 max-w-[680px] leading-[1.06]"
				style={{ fontSize: "clamp(36px, 6vw, 60px)" }}
			>
				Every flip, a new face.
			</h1>
			<p className="text-muted m-0 max-w-[440px] text-[17px]">
				Spontaneous video calls with real people. No scripts, no profiles — just
				genuine moments.
			</p>

			<AgeGate />

			<div className="mt-5 flex flex-wrap justify-center gap-3.5">
				{FEATURE_CARDS.map((card) => (
					<FeatureCard key={card.title} {...card} />
				))}
			</div>
		</section>
	);
}
