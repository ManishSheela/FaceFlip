import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["selector", '[data-theme="dark"]'],
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				bg: "var(--color-bg)",
				surface: "var(--color-surface)",
				text: "var(--color-text)",
				divider: "var(--color-divider)",
				"on-accent": "var(--color-on-accent)",
				accent: {
					DEFAULT: "var(--color-accent)",
					100: "var(--color-accent-100)",
					200: "var(--color-accent-200)",
					400: "var(--color-accent-400)",
					600: "var(--color-accent-600)",
					700: "var(--color-accent-700)",
					800: "var(--color-accent-800)",
					900: "var(--color-accent-900)",
				},
				green: "var(--color-green)",
				red: "var(--color-red)",
				amber: "var(--color-amber)",
				"amber-tint": "var(--color-amber-tint)",
				neutral: {
					100: "var(--color-neutral-100)",
					200: "var(--color-neutral-200)",
					800: "var(--color-neutral-800)",
					900: "var(--color-neutral-900)",
				},
				"call-bg": "var(--color-call-bg)",
				"call-surface": "var(--color-call-surface)",
				"call-divider": "var(--color-call-divider)",
				"call-panel": "var(--color-call-panel)",
				"call-muted": "var(--color-call-muted)",
			},
			fontFamily: {
				heading: ["var(--font-heading)"],
				body: ["var(--font-body)"],
			},
			borderRadius: {
				sm: "var(--radius-sm)",
				md: "var(--radius-md)",
				lg: "var(--radius-lg)",
				pill: "var(--radius-pill)",
			},
			boxShadow: {
				"elev-sm": "var(--shadow-sm)",
				"elev-md": "var(--shadow-md)",
				"elev-lg": "var(--shadow-lg)",
				"elev-cta": "var(--shadow-cta)",
			},
			keyframes: {
				gradientShift: {
					"0%, 100%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
				},
				fadeSlideIn: {
					from: { opacity: "0", transform: "translateY(7px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
				heroGlow: {
					"0%, 100%": { opacity: "0.55" },
					"50%": { opacity: "0.85" },
				},
				gridDrift: {
					"0%": { transform: "translate3d(0, 0, 0)" },
					"100%": { transform: "translate3d(40px, 40px, 0)" },
				},
				orbit1: {
					"0%": { transform: "rotate(0deg) translateX(220px) rotate(0deg)" },
					"100%": {
						transform: "rotate(360deg) translateX(220px) rotate(-360deg)",
					},
				},
				orbit2: {
					"0%": {
						transform: "rotate(120deg) translateX(310px) rotate(-120deg)",
					},
					"100%": {
						transform: "rotate(480deg) translateX(310px) rotate(-480deg)",
					},
				},
				orbit3: {
					"0%": {
						transform: "rotate(240deg) translateX(170px) rotate(-240deg)",
					},
					"100%": {
						transform: "rotate(600deg) translateX(170px) rotate(-600deg)",
					},
				},
			},
			animation: {
				"gradient-shift": "gradientShift 9s ease-in-out infinite",
				"fade-slide-in": "fadeSlideIn 0.35s ease both",
				"hero-glow": "heroGlow 5s ease-in-out infinite",
				"grid-drift": "gridDrift 8s linear infinite",
				"orbit-1": "orbit1 14s linear infinite",
				"orbit-2": "orbit2 20s linear infinite",
				"orbit-3": "orbit3 10s linear infinite",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;
