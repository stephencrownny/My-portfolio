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
      },
      boxShadow: {
        'glass-sm': '0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-md': '0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        'glass-lg': '0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.06), 0 16px 32px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      },
      blur: {
        'glass-sm': '20px',
        'glass-md': '40px',
        'glass-lg': '60px',
      },
      borderRadius: {
        'glass-sm': '16px',
        'glass-md': '24px',
        'glass-lg': '32px',
      }
    },
  },
  plugins: [],
}
