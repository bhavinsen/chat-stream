module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      spacing: {
        96: "44rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
