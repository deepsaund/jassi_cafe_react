/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // Example Premium Blue
        secondary: "#1E293B", // Dark Slate
      }
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}
