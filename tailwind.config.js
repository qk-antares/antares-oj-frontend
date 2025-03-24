/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#165dff',
        easy: '#1cb8b8',
        medium: '#ffb800',
        hard: '#f63636',
        solved: '#01b328',
      },
    },
  },
  plugins: [],
}
