/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Corrected from 'color' to 'colors'
        lightlightGreen: "#dbf0eb",
        lightGreen: "#80c9b6",
        darkGreen: "#00926d",
      },
    },
  },
  plugins: [],
};
