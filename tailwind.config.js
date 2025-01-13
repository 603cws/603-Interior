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
      screens: {
        '3xl': '1920px', // Add a custom breakpoint for larger screens
      },
      // container: {
      //   center: true,
      //   padding: {
      //     DEFAULT: '1rem',
      //     sm: '2rem',
      //     lg: '4rem',
      //     xl: '5rem',
      //     '2xl': '6rem',
      //     '3xl': '8rem', // Optional custom padding for 3xl
      //   },
      // },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
