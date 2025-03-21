/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-bg": "#FFFFFF",
        "orange-gradient": "linear-gradient(to right, #E64D20 0%, #F67B39 77%",
        "light-sections": "#F7F7F7",
        "primary-text": "#333333",
        "footer-text": "#6C757D",
        "accent-orange": "#F67B39",
        "primary-text-faded": "rgba(51, 51, 51, 0.7)",
        "progress-bar-bg": "rgba(219, 219, 219, 0.8)",
        "progress-bar-undertext": "rgba(51, 51, 51, 0.45)",
        "calorie-tracker-icon": "#B4B4B4",
      },
    },
  },
  plugins: ["tailwindcss/postcss, autoprefixer"],
};
