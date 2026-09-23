/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2A4E',
          light: '#243A66',
          dark: '#131E3A',
        },
        gold: {
          DEFAULT: '#D4A24C',
          light: '#E0B76E',
          dark: '#B8893A',
        },
        bg: '#F7F8FA',
        info: '#3B82C4',
        text: '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}