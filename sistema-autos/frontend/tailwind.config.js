/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        chasis: '#14161A',
        panel: '#1E2128',
        acero: '#4C7EA8',
        naranja: '#E8601C',
        hueso: '#F2F1ED',
        grafito: '#3A3E47',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
