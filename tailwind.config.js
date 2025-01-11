/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        Raleway: ["Raleway"],
        Convergence: ["Convergence"],
      },
      colors: {
        customYellow: "#fff9c9",
        customGray: "#817a78",
      },
      width: {
        1524: "1524px",
      },
      height: {
        810: "810px",
      },
      keyframes: {
        blink: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        blink: 'blink 1s infinite',
      },
    },
  },
  plugins: [],
};
