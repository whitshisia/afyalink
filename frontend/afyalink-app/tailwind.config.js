/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Sora', 'sans-serif'],
        'body': ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#edfbf3',
          100: '#c4f5dc',
          200: '#8eedc0',
          300: '#4fdd9a',
          400: '#25c87c',
          500: '#16a863',
          600: '#118a52',
          700: '#0c6b40',
          800: '#084d2e',
          900: '#052e1c',
          950: '#021a11',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out both',
        'float': 'float 6s ease-in-out infinite',
        'ticker': 'ticker 22s linear infinite',
        'pulse-ring': 'pulseRing 2s infinite',
      },
      keyframes: {
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(24px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(22,168,99,0.4)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(22,168,99,0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(22,168,99,0)' },
        },
      },
    },
  },
  plugins: [],
}