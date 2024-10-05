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
        'blue-whale': '#04204A',
        'casablanca': '#F3B643',
        'golden-bell': '#d59011',
        'alto':'#D9D9D9',
      },
    },
  },
  plugins: [],
};
export default config;
