/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Swiss design is mostly B&W, we can rely on standard black/white
      }
    },
  },
  plugins: [],
}
