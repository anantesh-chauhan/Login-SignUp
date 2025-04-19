/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your project structure
    ],
    theme: {
      extend: {
        keyframes: {
          marquee: {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(-100%)' },
          },
        },
        animation: {
          marquee: 'marquee 8s linear infinite', // Adjust duration as needed
        },
      },
    },
    darkMode: 'class', // if you're using dark mode via class
    plugins: [],
  };
  /** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          marquee: {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(-100%)' },
          },
        },
        animation: {
          marquee: 'marquee 10s linear infinite', // You can change 10s to 2s for faster speed
        },
      },
    },
    darkMode: 'class',
    plugins: [],
  };
  