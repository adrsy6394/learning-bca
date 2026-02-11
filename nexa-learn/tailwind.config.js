/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", //  Enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transform: ["group-hover"],
      rotate: {
        "y-180": "rotateY(180deg)",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide")
  ],
};
