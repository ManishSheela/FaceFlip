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
			},
			fontFamily: {
				heading: ["var(--font-heading)"],
				body: ["var(--font-body)"],
			},
			borderRadius: {
				sm: "var(--radius-sm)",
				md: "var(--radius-md)",
				lg: "var(--radius-lg)",
			},
			boxShadow: {
				"elev-sm": "var(--shadow-sm)",
				"elev-md": "var(--shadow-md)",
				"elev-lg": "var(--shadow-lg)",
			},
			keyframes: {
				radarPulse: {
					"0%": { transform: "scale(0.55)", opacity: "0.8" },
					"100%": { transform: "scale(2.3)", opacity: "0" },
				},
				gradientShift: {
					"0%, 100%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
				},
				fadeSlideIn: {
					from: { opacity: "0", transform: "translateY(7px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
			},
			animation: {
				"radar-pulse": "radarPulse 2.2s ease-out infinite",
				"gradient-shift": "gradientShift 9s ease-in-out infinite",
				"fade-slide-in": "fadeSlideIn 0.35s ease both",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;
