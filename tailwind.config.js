/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#183438', mid: '#1e3d41', light: '#224146', hover: '#264b50', card: '#1a3b3f' },
        accent: { DEFAULT: '#D85A30', light: '#E07050', dim: 'rgba(216,90,48,0.15)' },
        border: { DEFAULT: '#2a5259', light: '#3a6570' },
        text: { primary: '#e8f4f5', secondary: '#8fb3b8', muted: '#4a7a80' },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-dm-serif)', 'Georgia', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'pulse-dot': 'pulseDot 2s infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '.5', transform: 'scale(.8)' } },
      },
    },
  },
  plugins: [],
}
