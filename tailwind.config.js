/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1E1A2B',  // Dark violet
          DEFAULT: '#4A3A78', // Medium violet
          light: '#8A6FD4',  // Light violet
        },
        accent: {
          gold: '#FFD700',
          emerald: '#50C878',
        },
        background: {
          dark: '#121212',
          card: 'rgba(46, 51, 69, 0.8)',
        }
      },
      fontFamily: {
        title: ['Orbitron', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


