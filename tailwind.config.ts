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
        primary: "#F8BBD0",
        secondary: "#E1BEE7",
        accent: "#FFCC80",
        background: "#FFF8F9",
        text: "#333333",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        secondary: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
