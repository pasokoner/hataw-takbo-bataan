/** @type {import('tailwindcss').Config} */

/*eslint-disable @typescript-eslint/no-var-requires*/
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#0062ad",
        km3: "#0D632B",
        km5: "#EB1C24",
        km10: "#2D3091",
      },

      // animation: {
      //   "animate-spin": "spin 1s linear infinite",
      // },
      // keyframes: {
      //   pulse: {
      //     "0%": {
      //       transform: "rotate(0deg)",
      //     },
      //     "100%": {
      //       transform: "rotate(360deg)",
      //     },
      //   },
      // },
    },
  },
  plugins: [],
};
