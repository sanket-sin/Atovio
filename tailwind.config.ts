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
          navy: "#050b18",
          navy2: "#0a1628",
          navy3: "#0f2040",
          slate: "#1a2d4a",
          slate2: "#243d5c",
          text: "#e8f4ff",
          muted: "#7da5c9",
          dim: "#4a728a",
          accent: "#3d9eff",
          accent2: "#60b4ff",
          compare: "#a78bfa",
          good: "#00e5aa",
          moderate: "#ffd24d",
          poor: "#ff8c42",
          unhealthy: "#ff4d6d",
          severe: "#c77dff",
          hazardous: "#9b2dff",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: ["var(--font-dm-serif)", "Georgia", "serif"],
        body: ["var(--font-sora)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        outfit: ["var(--font-outfit)", "system-ui", "sans-serif"],
        numeric: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
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
        ticker: "ticker 28s linear infinite",
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
