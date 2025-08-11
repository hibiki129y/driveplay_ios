/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#61D4D4',
        accent: '#FFB3C1',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        bg: '#0F172A',
        'bg-light': '#1E293B',
        'text-primary': '#F8FAFC',
        'text-secondary': '#CBD5E1',
      },
      borderRadius: {
        'xs': '12px',
        'sm': '16px',
        'md': '20px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      fontSize: {
        'base': '16px',
        'button': '18px',
        'title': '24px',
        'heading': '32px',
      },
    },
  },
  plugins: [],
}
