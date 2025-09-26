module.exports = {
  mode: "jit",
  content: ["./src/**/**/*.{js,ts,jsx,tsx,html,mdx}", "./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    screens: { lg: { max: "1440px" }, md: { max: "1050px" }, sm: { max: "550px" } },
    extend: {
      colors: {
        black: {
          900: "var(--black_900)",
          "900_0c": "var(--black_900_0c)",
          "900_7f": "var(--black_900_7f)",
          "900_cc": "var(--black_900_cc)",
        },
        blue_gray: {
          100: "var(--blue_gray_100)",
          200: "var(--blue_gray_200)",
          900: "var(--blue_gray_900)",
          "100_01": "var(--blue_gray_100_01)",
          "100_02": "var(--blue_gray_100_02)",
          "900_66": "var(--blue_gray_900_66)",
        },
        gray: {
          50: "var(--gray_50)",
          100: "var(--gray_100)",
          900: "var(--gray_900)",
          "500_66": "var(--gray_500_66)",
          "50_01": "var(--gray_50_01)",
          "900_cc": "var(--gray_900_cc)",
        },
        orange: { a200: "var(--orange_a200)" },
        teal: { a700: "var(--teal_a700)" },
        white: { a700: "var(--white_a700)" },
      },
      boxShadow: { xs: "6px 6px 54px 0 #0000000c" },
      fontFamily: { Montserrat: "Montserrat" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
