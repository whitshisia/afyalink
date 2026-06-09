/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#edfbf3",
          100: "#c4f5dc",
          200: "#8eedc0",
          300: "#4fdd9a",
          400: "#25c87c",
          500: "#16a863",
          600: "#118a52",
          700: "#0c6b40",
          800: "#084d2e",
          900: "#052e1c",
          950: "#021a11",
        },
        teal: {
          500: "#0ea5a0",
          100: "#ccf2f1",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
        glow: "0 0 0 3px rgba(17,138,82,0.25)",
      },
    },
  },
  plugins: [],
};
