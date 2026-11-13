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
        // SAIGETSU Brand Color System (Ref: Asian Food Presentation Deck)
        saigetsu: {
          red: "#BA382A",           // Signature vermilion / terracotta red
          "red-dark": "#8B1E1E",    // Deep wine / crimson block
          "red-light": "#FDF2F0",   // Soft terracotta blush
          orange: "#D97330",        // Warm amber / ochre
          dark: "#1C1917",          // Crisp dark stone 900
          stone: "#44403C",         // Stone 700 for readable body
          muted: "#78716C",         // Stone 500 for captions
          cream: "#FAF8F5",         // Warm porcelain ivory background
          border: "#E7E5E4",        // Clean stone 200 border
          sand: "#F5F0EA",          // Soft secondary surface
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Oswald", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        saigetsu: "0 10px 30px -5px rgba(186, 56, 42, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.04)",
        "saigetsu-hover": "0 20px 40px -10px rgba(186, 56, 42, 0.16), 0 8px 16px -4px rgba(28, 25, 23, 0.06)",
        "saigetsu-card": "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
      },
    },
  },
  plugins: [],
};
export default config;
