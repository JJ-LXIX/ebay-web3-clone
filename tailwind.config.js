/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cus_black: "#000002",
        cus_blue: "#35baee",
        cus_violet: "#e300dc",
        cus_red: "#e45411",
      },
    },
  },
  plugins: [],
};
