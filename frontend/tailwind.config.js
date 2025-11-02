/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      spacing: {
        '15': '3.75rem',
        '50': '12.5rem',
        '105': '26.25rem',
        '120': '30rem',
        '250': '62.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      rotate: {
        '12': '12deg',
        '-12': '-12deg',
        '168': '168deg',
      },
      width: {
        '49/50': '98%',
      },
      height: {
        '1/2': '50%',
        '2/3': '66.666667%',
      },
      maxWidth: {
        '1/2': '50%',
        '49/50': '98%',
        '10/11': '90.909091%',
      },
      maxHeight: {
        '1/2': '50%',
        '49/50': '98%',
      },
    },
  },
  plugins: [],
}
