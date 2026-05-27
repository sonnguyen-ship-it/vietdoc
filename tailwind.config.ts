import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        red: "#C8102E",
        gold: "#F5A623",
        ink: "#1A1208",
        ink2: "#2D2416",
        paper: "#FDFAF4",
        paper2: "#F5F0E4",
        paper3: "#EDE7D5",
        muted: "#7A6E5A",
        hint: "#B5A98C",
        border: "rgba(26,18,8,0.10)",
        border2: "rgba(26,18,8,0.18)",
        green: "#1D6E45",
        blue: "#1A4E7A",
        wf: {
          surface: "#f2ede4",
          ink: "#1a1208",
          red: "#C8102E",
          lime: "#c8ff00",
          violet: "#b388ff",
          coral: "#ff6b6b",
          cyan: "#00e5ff",
        },
      },
      borderRadius: {
        lg: "10px",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        tcard: "0 4px 16px rgba(26,18,8,0.08)",
      },
    },
  },
  plugins: [],
}
export default config
