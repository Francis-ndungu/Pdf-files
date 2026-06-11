/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}','./components/**/*.{js,jsx}','./lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans','system-ui','sans-serif'],
        serif: ['DM Serif Display','Georgia','serif'],
      },
      colors: {
        bg:      { DEFAULT:'#183438', mid:'#1e3d41', light:'#224146', hover:'#264b50', card:'#1a3b3f' },
        accent:  { DEFAULT:'#D85A30', light:'#E07050', dim:'rgba(216,90,48,0.14)' },
        border:  { DEFAULT:'#2a5259', light:'#3a6570' },
        t:       { 1:'#e8f4f5', 2:'#8fb3b8', 3:'#5a8a90' },
        organize:{ DEFAULT:'#3B82F6', dim:'rgba(59,130,246,0.15)', text:'#93C5FD' },
        edit:    { DEFAULT:'#8B5CF6', dim:'rgba(139,92,246,0.15)', text:'#C4B5FD' },
        optimize:{ DEFAULT:'#10B981', dim:'rgba(16,185,129,0.15)', text:'#6EE7B7' },
        secure:  { DEFAULT:'#F59E0B', dim:'rgba(245,158,11,0.15)',  text:'#FCD34D' },
        cvtto:   { DEFAULT:'#F97316', dim:'rgba(249,115,22,0.15)',  text:'#FEB38A' },
        cvtfrom: { DEFAULT:'#06B6D4', dim:'rgba(6,182,212,0.15)',   text:'#67E8F9' },
        ai:      { DEFAULT:'#A855F7', dim:'rgba(168,85,247,0.15)',  text:'#D8B4FE' },
      },
      screens: { xs:'480px' },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.4)',
        glow: '0 0 40px rgba(216,90,48,0.25)',
      },
      keyframes: {
        slideDown: { from:{ opacity:'0', transform:'translateY(-8px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        fadeIn:    { from:{ opacity:'0' }, to:{ opacity:'1' } },
        progress:  { from:{ width:'0%' }, to:{ width:'100%' } },
      },
      animation: {
        'slide-down': 'slideDown 0.2s ease',
        'fade-in':    'fadeIn 0.3s ease',
      },
    },
  },
  plugins: [],
}
