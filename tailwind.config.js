/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "13px 13px 20px #ebebeb, -13px -13px 28px #ffffff",
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
        zcool: ['"ZCOOL KuaiLe"', "cursive"],
        sans: ["DM Sans", "sans-serif"],
        montaga: ["Montaga", "serif"],
        montserratAlt: ["Montserrat Alternates", "sans-serif"],
        lora: ["Lora", "serif"], // Add Lora font with a fallback
        lato: ["Lato", "sans-serif"], // Add Lato font with a fallback
        lexend: ["Lexend Deca", "sans-serif"], // Add Lexend Deca with a fallback
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
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        bikeSlide: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        blink: "blink 1s infinite",
        blink: "blink 1s infinite",
        "fade-in": "fadeIn 0.7s ease-in-out",
        bikeSlide: "bikeSlide 4s ease-out forwards",
      },
      screens: {
        "3xl": "1800px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "3rem",
        },
      },
      // screens: {
      //   sm: "450px", // Full width for small screens
      //   md: "640px", // Medium screens
      //   lg: "768px", // Large screens
      //   xl: "1024px", // Extra-large screens
      //   "2xl": "1280px", // 2XL screens
      //   "3xl": "1440px", // Custom 3XL screens
      //   "4xl": "1920px", // Custom 4XL screens
      // },
      // container: {
      //   center: true,
      //   padding: {
      //     DEFAULT: "1rem",
      //     sm: "2rem",
      //     lg: "4rem",
      //     xl: "5rem",
      //     "2xl": "6rem",
      //     "3xl": "8rem", // Optional custom padding for 3xl
      //   },
      // },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
