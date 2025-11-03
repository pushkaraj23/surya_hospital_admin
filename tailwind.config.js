/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#003B76", // Deep Blue
        secondary: "#F59422", // Orange
        accent: "#EFB626", // Yellow
        "primary-dark": "#002a56",
        "secondary-light": "#fbb040",
      },
      fontFamily: {
        primary: ["Quicksand", "sans-serif"],
        secondary: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
