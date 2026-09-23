/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#080B0C',
          deep: '#0B1012',
          surface: '#12181A',
          card: '#141C1E',
          cardHover: '#182427',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(34, 197, 94, 0.3)',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
        brand: {
          emerald: '#10B981',
          neon: '#22C55E',
          lime: '#84CC16',
          teal: '#14B8A6',
          cyan: '#06B6D4',
          accent: '#10B981',
        }
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '30px',
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-neon': '0 0 30px -5px rgba(34, 197, 94, 0.4)',
        'glow-lime': '0 0 25px -5px rgba(132, 204, 22, 0.35)',
        'card-dark': '0 8px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
