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
          950: '#06070c',
          900: '#0a0c16',
          850: '#0e1120',
          800: '#14182c',
          700: '#1c213d',
          600: '#262d53',
        },
        brand: {
          violet: '#8b5cf6',
          fuchsia: '#d946ef',
          cyan: '#06b6d4',
          indigo: '#6366f1',
          emerald: '#10b981',
          rose: '#f43f5e',
        }
      },
      animation: {
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
        'float-slow': 'float 5s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
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
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-glow': 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.25) 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}
