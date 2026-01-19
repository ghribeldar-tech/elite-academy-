/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'elite-gold': '#D4AF37', // اللون الذهبي الفاخر
        'elite-dark': '#020617', // اللون الكحلي الغامق جداً
      },
      fontFamily: {
        'luxury': ['Cinzel', 'serif'],
        'arabic': ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
