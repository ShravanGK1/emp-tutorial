/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',    // Background for dark mode header
          light: '#f8fafc',   // Background for light mode
          active: '#10b981',  // Active status green
          inactive: '#64748b',// Inactive status gray
          release: '#ef4444', // Release button red
        }
      }
    },
  },
  plugins: [],
}
