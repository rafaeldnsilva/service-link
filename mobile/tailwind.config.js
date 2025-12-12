/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2C097F",
        "primary-light": "#1d4ed8",
        "background-light": "#f6f6f8",
        "background-dark": "#151022",
        "text-primary-light": "#1C1C1E",
        "text-secondary-light": "#8A8A8E",
        "text-primary-dark": "#FFFFFF",
        "text-secondary-dark": "#A0A0A0",
        success: "#34C759",
        error: "#FF3B30",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
      },
    },
  },
  plugins: [],
};
