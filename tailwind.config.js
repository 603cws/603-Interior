/** @type {import('tailwindcss').Config} */
import scrollbarHide from "tailwind-scrollbar-hide";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "13px 13px 20px #ebebeb, -13px -13px 10px #ffffff",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(145deg, #ffffff, #ffffff)",
        "login-custom-gradient":
          "radial-gradient(circle at top left, #D3DAD8 10%, #85A59E 40%, #2C5C4E 90%)",
      },
      borderRadius: {
        "lg-19": "19px",
      },
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
        Raleway: ["Raleway"],
        Convergence: ["Convergence"],
        sans: ["DM Sans", "sans-serif"],
        montaga: ["Montaga", "serif"],
        montserratAlt: ["Montserrat Alternates", "sans-serif"],
        lora: ["Lora", "serif"], // Add Lora font with a fallback
        lato: ["Lato", "sans-serif"], // Add Lato font with a fallback
        inter: ["Inter", "sans-serif"],
        vampiroOne: ["Vampiro One", "cursive"],
        TimesNewRoman: ["times-new-roman", "sans-serif"],
        Georgia: ["georgia", "sans-serif"],
        Alegreya: ["Alegreya", "sans-serif"],
        segoe: ["Segoe UI", "sans-serif"],
      },
      colors: {
        customYellow: "#fff9c9",
        customGray: "#817a78",
        customTop: "#D3DAD8", // Light grayish-green
        customMiddle: "#85A59E", // Muted green
        customBottom: "#2C5C4E", // Dark green
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
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        bikeSlide: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        message1: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "100%" },
        },
        message2: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "100%" },
        },
        message3: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "100%" },
        },
        shake: {
          "10%, 90%": { transform: "translateX(-1px)" },
          "20%, 80%": { transform: "translateX(2px)" },
          "30%, 50%, 70%": { transform: "translateX(-4px)" },
          "40%, 60%": { transform: "translateX(4px)" },
        },
        bounceY: {
          "0%, 100%": {
            transform: "translateY(-15%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
      animation: {
        blink: "blink 1s ease-in-out 2",
        "fade-in": "fadeIn 0.7s ease-in-out",
        bikeSlide: "bikeSlide 4s ease-out forwards",
        message1: "message1 3s ease-in-out ",
        message3: "message3 3s ease-in-out ",
        message2: "message2 3s ease-in-out ",
        shake: "shake 0.8s ease-in-out",
        bounceY: "bounceY 1s infinite",
      },
      screens: {
        xs: "350px",
        "3xl": "1800px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "3rem",
        },
      },
    },
  },
  plugins: [scrollbarHide],
};
