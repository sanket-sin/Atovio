import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bqa: {
          navy:      "rgb(var(--bqa-navy) / <alpha-value>)",
          navy2:     "rgb(var(--bqa-navy2) / <alpha-value>)",
          navy3:     "rgb(var(--bqa-navy3) / <alpha-value>)",
          slate:     "rgb(var(--bqa-slate) / <alpha-value>)",
          slate2:    "rgb(var(--bqa-slate2) / <alpha-value>)",
          text:      "rgb(var(--bqa-text) / <alpha-value>)",
          muted:     "rgb(var(--bqa-muted) / <alpha-value>)",
          dim:       "rgb(var(--bqa-dim) / <alpha-value>)",
          accent:    "rgb(var(--bqa-accent) / <alpha-value>)",
          accent2:   "rgb(var(--bqa-accent2) / <alpha-value>)",
          compare:   "rgb(var(--bqa-compare) / <alpha-value>)",
          good:      "rgb(var(--bqa-good) / <alpha-value>)",
          moderate:  "rgb(var(--bqa-moderate) / <alpha-value>)",
          poor:      "rgb(var(--bqa-poor) / <alpha-value>)",
          unhealthy: "rgb(var(--bqa-unhealthy) / <alpha-value>)",
          severe:    "rgb(var(--bqa-severe) / <alpha-value>)",
          hazardous: "rgb(var(--bqa-hazardous) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        outfit: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        numeric: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        /** Full-bleed layout: section wrappers use max-w-container + horizontal padding */
        container: "100%",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "sensor-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(2.2)", opacity: "1" },
        },
        "ring-expand": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        "hero-drift": {
          "0%": { transform: "scale(1.05) translateY(0)" },
          "100%": { transform: "scale(1.08) translateY(-12px)" },
        },
      },
      animation: {
        ticker: "ticker 80s linear infinite",
        "sensor-pulse": "sensor-pulse var(--dur, 3s) ease-in-out infinite var(--delay, 0s)",
        "ring-expand": "ring-expand var(--dur, 4s) ease-out infinite var(--delay, 0s)",
        blink: "blink 1.5s ease-in-out infinite",
        "hero-drift": "hero-drift 30s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
export default config;
