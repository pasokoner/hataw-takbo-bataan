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
    },
  },
  plugins: [],
};
