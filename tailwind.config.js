/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        edtech: {
          header: '#15803d',     // Deep education green like reference header
          headerLight: '#16a34a',
          accent: '#f59e0b',     // Bright star yellow
          bg: '#f0fdf4',         // Very soft green tint background
          card: '#ffffff',
          primary: '#059669',
          primaryHover: '#047857',
          sky: '#0284c7',
          sun: '#eab308',
          heart: '#ef4444',
          purple: '#8b5cf6',
          pink: '#ec4899'
        }
      },
      fontFamily: {
        sans: ['"Nunito"', '"Nunito Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'edtech': '0 4px 20px -2px rgba(16, 185, 129, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.05)',
        'playful': '0 8px 0 0 rgba(5, 150, 105, 0.2)',
        'pop': '0 10px 25px -5px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'bounce-short': 'bounceShort 0.5s ease-in-out 2',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
