import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#eab308", // amarelo (pode ajustar conforme sua identidade)
          dark: "#ca8a04",
        },
        secondary: {
          DEFAULT: "#1f2937",
        },
      },
    },
  },
  plugins: [],
};

export default config;

