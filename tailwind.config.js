/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#33AFA6',       // Màu chính
        'primary-dark': '#0B7B7A', // Màu đậm
        'bg-login': '#EDF6F5',     // Background login
      }
    },
  },
  plugins: [],
}