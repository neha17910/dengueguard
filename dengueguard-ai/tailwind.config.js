/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        neon: {
          cyan: '#06b6d4',
          teal: '#14b8a6',
          emerald: '#10b981',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          rose: '#f43f5e',
          amber: '#f59e0b',
        },
        dark: {
          bg: '#080d1a',
          surface: '#0f172a',
          card: '#131e36',
          cardHover: '#182544',
          border: '#1e293b',
          borderLight: '#334155',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px -2px rgba(6, 182, 212, 0.4), 0 0 6px -1px rgba(6, 182, 212, 0.2)',
        'neon-teal': '0 0 15px -2px rgba(20, 184, 166, 0.4), 0 0 6px -1px rgba(20, 184, 166, 0.2)',
        'neon-emerald': '0 0 15px -2px rgba(16, 185, 129, 0.4), 0 0 6px -1px rgba(16, 185, 129, 0.2)',
        'neon-rose': '0 0 15px -2px rgba(244, 63, 94, 0.4), 0 0 6px -1px rgba(244, 63, 94, 0.2)',
        'glow-sm': '0 0 10px rgba(6, 182, 212, 0.25)',
        'glow-md': '0 0 20px rgba(6, 182, 212, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
