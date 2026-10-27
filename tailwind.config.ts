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
        bg: "var(--bg)",
        fg: "var(--fg)",
        mute: "var(--mute)",
        line: "var(--line)",
        card: "var(--card)",
        accent: "var(--accent)",
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        serif: ["var(--font-head)"],
      },
    },
  },
  plugins: [],
};

export default config;

