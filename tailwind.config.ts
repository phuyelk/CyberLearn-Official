import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bg-app": "#0a0a0b",
        "bg-panel": "#111113",
        "bg-elevated": "#1a1a1e",
        border: "#242428",
        "border-focus": "#3a3a42",
        "text-primary": "#ededef",
        "text-secondary": "#8b8b99",
        "text-muted": "#4a4a56",
        accent: "#6e56cf",
        "accent-soft": "rgba(110, 86, 207, 0.13)",
        success: "#30a46c",
        warning: "#f76b15",
        danger: "#e5484d",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-geist-sans)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        body: ["15px", { lineHeight: "1.6" }],
      },
      borderRadius: {
        card: "8px",
        input: "6px",
        badge: "4px",
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
      },
      transitionDuration: {
        hover: "150ms",
        panel: "200ms",
      },
      maxWidth: {
        content: "64rem",
      },
    },
  },
  plugins: [],
};
export default config;
