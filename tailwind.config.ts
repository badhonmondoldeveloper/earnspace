import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36abf8',
          500: '#0c8ee9',
          600: '#0070c7',
          700: '#0159a1',
          800: '#064b85',
          900: '#0b3f6f',
          950: '#072849',
        },
        gold: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        }
      },
    },
  },
  plugins: [],
};
export default config;

