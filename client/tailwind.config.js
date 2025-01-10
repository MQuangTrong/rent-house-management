/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    ".public/index.html"
  ],
  theme: {
    extend: {
      width: {
        '1100': '1100px'
      },
      backgroundColor: {
        primary: "#F5F5F5",
        secondary1: "#E4DECE",
        secondary2: "#BE8A28"
      },
      textColor: {
        secondary2: "#BE8A28"
      },
      maxWidth: {
        '600': '600px'
      },
      cursor: {
        pointer: 'pointer'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
