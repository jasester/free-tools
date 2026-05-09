/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        dark: {
          50: '#f0f0f5',
          100: '#8888a0',
          200: '#55556a',
          300: '#2a2a3a',
          400: '#1e1e2e',
          500: '#16161f',
          600: '#12121a',
          700: '#0e0e16',
          800: '#0a0a0f',
          900: '#06060a',
        },
        light: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f7',
          300: '#e5e5e7',
          400: '#d4d4d8',
          500: '#a1a1aa',
          600: '#71717a',
          700: '#52525b',
          800: '#3f3f46',
          900: '#27272a',
        },
        accent: {
          blue: '#6366f1',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
