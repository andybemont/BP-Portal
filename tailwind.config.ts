import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      green: "#279989",
      blue: "#00718E",
      darkblue: "#003A70",
      gray: "#404653",
      white: "#F7F7F7",
      black: "#000000",
      pop1: "#D0DF68",
      pop2: "#A5DCE8",
      warning: "#dc2626",
    },
    extend: {
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
      },
    },
    keyframes: {
      shimmer: {
        "100%": {
          transform: "translateX(100%)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
