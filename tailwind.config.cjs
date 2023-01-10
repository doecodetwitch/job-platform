/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#F8AD9D',
          secondary: '#B79915',
          secondaryHover: '#A48A13',
          tertiary: '#F08080',
          tertiaryHover: '#EE6D6D',
          black: '#252422',
          white: '#edf2f4'
        },
      }
    },
  },
  plugins: [],
};
