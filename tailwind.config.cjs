/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#F8AD9D',
          secondary: '#FFDAB9',
          tertiary: '#F08080',
          black: '#252422',
          white: '#edf2f4'
        },
      }
    },
  },
  plugins: [],
};
