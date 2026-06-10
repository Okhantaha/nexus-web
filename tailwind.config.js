/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F47B20',
        'primary-dark': '#D96A10',
        'primary-light': '#FFF0E6',
        surface: '#FFFFFF',
        background: '#F5F5F5',
        'text-primary': '#1A1A1A',
        'text-secondary': '#666666',
        'text-muted': '#999999',
        dark: '#1C1C1E',
        'dark-card': '#2C2C2E',
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        mobile: '430px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
        orange: '0 4px 20px rgba(244,123,32,0.4)',
      },
    },
  },
  plugins: [],
}
