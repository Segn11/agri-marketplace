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
        // AgriMarket Brand Emerald / Jade Palette
        brand: {
          50: '#f0fdf9',
          100: '#ccfbee',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
          DEFAULT: '#0d9488',
        },
        // Forest Green Palette
        forest: {
          50: '#f2fbf4',
          100: '#e1f7e6',
          200: '#c5eed0',
          300: '#97deaa',
          400: '#61c67d',
          500: '#3ba95a',
          600: '#2c8946',
          700: '#256d39',
          800: '#225631',
          900: '#1d472a',
          950: '#0b2615',
          DEFAULT: '#256d39',
        },
        // Warm Golden Amber / Harvest Gold
        amberGold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          DEFAULT: '#f59e0b',
        },
        // Deep Night Teal (for high-contrast banners & dark hero)
        nightTeal: {
          900: '#092524',
          950: '#041817',
          DEFAULT: '#071f1e',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(15, 23, 42, 0.08)',
        'soft-lg': '0 8px 25px -4px rgba(15, 23, 42, 0.12)',
        'brand-glow': '0 4px 16px -2px rgba(13, 148, 136, 0.35)',
      },
    },
  },
  plugins: [],
};
export default config;
