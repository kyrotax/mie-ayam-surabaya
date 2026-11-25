import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Chinese Traditional Modern Palette
        chinese: {
          red: "#C41E3A",
          "deep-red": "#8B0000",
          "dark-red": "#6B0000",
          gold: "#D4AF37",
          "bright-gold": "#FFD700",
          bronze: "#9A6B00",
          cream: "#FFF8E7",
          "cream-warm": "#FAF0DC",
          dark: "#2C1810",
          warm: "#6B4423",
        },
        // Legacy tokens kept for compatibility
        saigetsu: {
          red: "#C41E3A",
          "red-dark": "#8B0000",
          "red-light": "#FFF8E7",
          orange: "#D4AF37",
          dark: "#2C1810",
          stone: "#44403C",
          muted: "#6B4423",
          cream: "#FFF8E7",
          border: "#D4AF37",
          sand: "#FAF0DC",
        },
        admin: {
          "merah-jago": "#C41E3A",
          "merah-tua": "#8B0000",
          emas: "#D4AF37",
          "emas-terang": "#FFD700",
          "emas-tua": "#9A6B00",
          krem: "#FFF8E7",
          "krem-tua": "#FAF0DC",
          cokelat: "#2C1810",
          "cokelat-muda": "#6B4423",
          "hijau-buka": "#2E7D32",
          "abu-tutup": "#6B5B50",
          sukses: "#276B2B",
          "sukses-bg": "#E4F2E5",
          peringatan: "#8A5A00",
          "peringatan-bg": "#FBEBC8",
          bahaya: "#C41E3A",
          "bahaya-bg": "#FBE4E1",
          netral: "#6B4423",
          "netral-bg": "#FAF0DC",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Fraunces", "Georgia", "serif"],
        display: ["var(--font-heading)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-sans)", "DM Sans", "system-ui", "sans-serif"],
        body: ["var(--font-sans)", "DM Sans", "system-ui", "sans-serif"],
        "serif-sc": ["var(--font-serif-sc)", "Noto Serif SC", "serif"],
      },
      boxShadow: {
        gold: "0 10px 28px -6px rgba(139, 0, 0, 0.14), 0 4px 12px -2px rgba(212, 175, 55, 0.22)",
        "gold-lg": "0 18px 40px -8px rgba(139, 0, 0, 0.22), 0 6px 18px -4px rgba(212, 175, 55, 0.3)",
        saigetsu: "0 10px 30px -5px rgba(186, 56, 42, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.04)",
      },
      borderRadius: {
        card: "16px",
        button: "9999px",
      },
    },
  },
  plugins: [],
};
export default config;
