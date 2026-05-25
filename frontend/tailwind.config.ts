import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3A9DE9",
        secondary: "#F1F2F5",
        success: "#00A63D",
        warning: "#FE9900",
        danger: "#FF2157",
        surface: "#F8FAFC",
        text: "#1E2938",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
export default config;
