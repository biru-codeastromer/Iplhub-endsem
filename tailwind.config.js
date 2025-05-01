/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      './app/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          maroon: {
            500: '#800020',
          },
          space: {
            900: '#0f0f1a',
            800: '#1e1e2d',
          }
        },
        fontFamily: {
          rubik: ['var(--font-rubik)'],
          audiowide: ['var(--font-audiowide)'],
        },
      },
    },
    plugins: [],
  }