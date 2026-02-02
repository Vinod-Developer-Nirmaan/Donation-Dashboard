/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0f8',
          100: '#cce0f1',
          200: '#99c1e3',
          300: '#66a3d5',
          400: '#3384c7',
          500: '#003c7a',
          600: '#003162',
          700: '#00254a',
          800: '#001a31',
          900: '#000e19',
        },
        accent: {
          50: '#fff9e6',
          100: '#fff3cc',
          200: '#ffe799',
          300: '#ffdb66',
          400: '#ffcf33',
          500: '#ffbc00',
          600: '#cc9600',
          700: '#997100',
          800: '#664b00',
          900: '#332600',
        },
      },
    },
  },
  plugins: [],
}