/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cabinet Grotesk', 'Inter', 'sans-serif'],
        body: ['Satoshi', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.1em',
        wider: '0.2em',
        widest: '0.3em',
      },
      colors: {
        gray: {
          50: '#F7F7F7',
          100: '#EEEEEE',
          200: '#E0E0E0',
          300: '#CCCCCC',
          400: '#999999',
          500: '#666666',
          600: '#444444',
          700: '#222222',
          800: '#111111',
          900: '#0A0A0A',
        },
        black: '#000000',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
