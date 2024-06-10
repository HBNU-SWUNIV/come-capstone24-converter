// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg:"976px",
      xl: "1440px",
      custom: "600px",
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      spacing: {
        "128": "32rem",
        "144": "36rem",
      },
      borderRadius: {
        "4xl":"2rem",
      },
      colors: {
        blue: "#1fb6ff",
        purple: "#7e5bef",
        pink: "#ff7849",
        orange: "#ff7849",
        green: "#13ce66",
        "gray-dark":"#273444",
        gray: "#8492a6",
      }
    },
  },
  plugins: [],
}
