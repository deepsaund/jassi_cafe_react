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
        primary: {
          DEFAULT: "#2563EB",
          light: "#60A5FA",
          dark: "#1D4ED8",
        },
        secondary: {
          DEFAULT: "#1E293B",
          darker: "#0F172A",
        },
        neural: {
          slate: "#0f172a",
          indigo: "#4f46e5",
          violet: "#7c3aed",
          cyan: "#0891b2",
        },
        background: {
          light: "#F8FAFC",
          dark: "#070B14",
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}
