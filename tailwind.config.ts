import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			/* ── shadcn compatibility (resolved from CSS vars) ── */
  			background: "var(--background)",
  			foreground: "var(--foreground)",
  			card: {
  				DEFAULT: "var(--card)",
  				foreground: "var(--card-foreground)"
  			},
  			popover: {
  				DEFAULT: "var(--popover)",
  				foreground: "var(--popover-foreground)"
  			},
  			primary: {
  				DEFAULT: "var(--primary)",
  				foreground: "var(--primary-foreground)"
  			},
  			secondary: {
  				DEFAULT: "var(--secondary)",
  				foreground: "var(--secondary-foreground)"
  			},
  			muted: {
  				DEFAULT: "var(--muted)",
  				foreground: "var(--muted-foreground)"
  			},
  			accent: {
  				DEFAULT: "hsl(var(--accent))",
  				bright: "hsl(var(--accent-bright))",
  				deep: "hsl(var(--accent-deep))",
  				cyan: "hsl(var(--accent-cyan))",
  				foreground: "var(--accent-foreground)"
  			},
  			destructive: {
  				DEFAULT: "var(--destructive)",
  				foreground: "var(--destructive-foreground)"
  			},
  			border: "var(--border)",
  			input: "var(--input)",
  			ring: "var(--ring)",
  			chart: {
  				"1": "var(--chart-1)",
  				"2": "var(--chart-2)",
  				"3": "var(--chart-3)",
  				"4": "var(--chart-4)",
  				"5": "var(--chart-5)"
  			},

  			/* ── New design system tokens ── */
  			surface: {
  				base: "hsl(var(--bg-base))",
  				DEFAULT: "hsl(var(--bg-surface))",
  				elevated: "hsl(var(--bg-elevated))",
  				glass: "hsl(var(--bg-glass))",
  			},
  			text: {
  				primary: "hsl(var(--text-primary))",
  				secondary: "hsl(var(--text-secondary))",
  				muted: "hsl(var(--text-muted))",
  			},
  			stroke: {
  				subtle: "hsl(var(--stroke-subtle))",
  				DEFAULT: "hsl(var(--stroke-default))",
  				strong: "hsl(var(--stroke-strong))",
  				accent: "hsl(var(--stroke-accent))",
  			},
  			semantic: {
  				success: "hsl(var(--success))",
  				warning: "hsl(var(--warning))",
  				danger: "hsl(var(--danger))",
  			},
  		},
  		borderRadius: {
  			lg: "var(--radius)",
  			md: "calc(var(--radius) - 4px)",
  			sm: "calc(var(--radius) - 8px)",
  			input: "var(--radius-input)",
  			pill: "var(--radius-pill)",
  		},
  		boxShadow: {
  			rim: "inset 0 1px 0 0 hsl(0 0% 100% / 0.08)",
  			card: "0 24px 64px -32px hsl(222 80% 2% / 0.9)",
  			"glow-sm": "0 0 24px -6px hsl(217 91% 60% / 0.45)",
  			"glow-md": "0 0 48px -10px hsl(217 91% 60% / 0.55)",
  			"glow-lg": "0 0 120px 12px hsl(217 91% 60% / 0.35)",
  		},
  		fontSize: {
  			display: ["clamp(2.75rem, 6.2vw, 5.5rem)", {
  				letterSpacing: "-0.035em",
  				lineHeight: "0.98",
  				fontWeight: "700",
  			}],
  			eyebrow: ["11px", {
  				letterSpacing: "0.14em",
  				lineHeight: "1.4",
  				fontWeight: "500",
  			}],
  		},
  		keyframes: {
  			"breathe": {
  				"0%, 100%": { opacity: "0.85", transform: "scale(1)" },
  				"50%": { opacity: "1", transform: "scale(1.03)" },
  			},
  			"shimmer": {
  				"0%": { transform: "translateX(-100%)" },
  				"100%": { transform: "translateX(100%)" },
  			},
  		},
  		animation: {
  			breathe: "breathe 9s ease-in-out infinite",
  			shimmer: "shimmer 4s ease-in-out infinite",
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
