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
        primary: "#006666",
        secondary: "#F1F2F5",
        success: "#00A63D",
        warning: "#FE9900",
        danger: "#FF2157",
        surface: "#E7E5E4",
        text: "#1E2938",
        // Keeping original PRD primary as an alternative if needed
        "zivio-blue": "#3A9DE9",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Space Mono", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        // Neumorphism shadows
        'neu-flat': '8px 8px 16px #c5c5c5, -8px -8px 16px #ffffff',
        'neu-pressed': 'inset 8px 8px 16px #c5c5c5, inset -8px -8px 16px #ffffff',
        'neu-sm': '4px 4px 8px #c5c5c5, -4px -4px 8px #ffffff',
        'neu-sm-pressed': 'inset 4px 4px 8px #c5c5c5, inset -4px -4px 8px #ffffff',
      },
      borderRadius: {
        'neu': '20px',
      }
    },
  },
  plugins: [],
};
export default config;
