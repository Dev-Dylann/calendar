/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./build/**/*.{html, js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans"],
      },
    },
  },
  plugins: [],
};
