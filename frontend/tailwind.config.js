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
          950: '#050505',
          900: '#0a0a0a',
          850: '#0f0f0f',
          800: '#141414',
          700: '#1f1f1f',
          600: '#2d2d2d',
        },
        gold: {
          300: '#F5D77A',
          400: '#E5C158',
          500: '#D4AF37',
          600: '#B8860B',
          700: '#8B6508',
        },
        amber: {
          rich: '#C68A1B',
          dark: '#7A4F01',
        },
        cream: {
          50: '#FDFCF7',
          100: '#F5F0E6',
          200: '#E8E1D3',
          300: '#C7BEAB',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5D77A 0%, #D4AF37 50%, #B8860B 100%)',
        'gold-gradient-hover': 'linear-gradient(135deg, #FFF0B3 0%, #F5D77A 50%, #D4AF37 100%)',
        'dark-glass': 'linear-gradient(180deg, rgba(20,20,20,0.7) 0%, rgba(10,10,10,0.85) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.3)',
        'gold-glow-lg': '0 0 50px -5px rgba(212, 175, 55, 0.45)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1.5deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
