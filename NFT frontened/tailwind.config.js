/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dark: {
          950: '#040d14',
          900: '#071520',
          850: '#0a1d2c',
          800: '#0e2638',
          700: '#14364f',
          600: '#1e4c6d',
        },
        aqua: {
          50: '#f0fafb',
          100: '#b2e5ed', // Palette Color 4
          200: '#99dde7', // Palette Color 1
          300: '#87dfe9', // Palette Color 3
          400: '#2ec7c0', // Palette Color 2
          500: '#00abc5', // Palette Color 5
          600: '#0092a8',
          700: '#007486',
          800: '#074e5b',
          900: '#0a3a44',
          950: '#041f26',
        },
        brand: {
          primary: '#00abc5',
          teal: '#2ec7c0',
          soft: '#87dfe9',
          ice: '#99dde7',
          light: '#b2e5ed',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      animation: {
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
        'float-slow': 'float 5s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'blur(20px)' },
          '100%': { opacity: '0.8', filter: 'blur(30px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.9' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-glow': 'radial-gradient(circle at 50% 0%, rgba(46, 199, 192, 0.25) 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}
