/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        Raleway: ["Raleway"],
        Convergence: ["Convergence"],
        zcool: ['"ZCOOL KuaiLe"', "cursive"],
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
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1s infinite",
        blink: "blink 1s infinite",
        "fade-in": "fadeIn 0.7s ease-in-out",
      },
      screens: {
        sm: "100%", // Full width for small screens
        md: "640px", // Medium screens
        lg: "768px", // Large screens
        xl: "1024px", // Extra-large screens
        "2xl": "1280px", // 2XL screens
        "3xl": "1440px", // Custom 3XL screens
        "4xl": "1920px", // Custom 4XL screens
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
