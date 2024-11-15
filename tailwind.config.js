/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        shakeAndScale: {
          '0%': { transform: 'scale(0.95) rotate(0deg)' },
          '25%': { transform: 'scale(1) rotate(-1deg)' },
          '50%': { transform: 'scale(1) rotate(1deg)' },
          '75%': { transform: 'scale(1) rotate(-1deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-20px) rotate(10deg)',
          }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        shakeAndScale: 'shakeAndScale 0.5s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}