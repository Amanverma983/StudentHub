/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        void: '#04040A',
        surface: '#0A0A14',
        'surface-2': '#111120',
        'surface-3': '#181830',
        violet: {
          950: '#1a0a3b',
          900: '#2d1166',
          800: '#4c1d95',
          700: '#6d28d9',
          600: '#7c3aed',
          500: '#8b5cf6',
          400: '#a78bfa',
          300: '#c4b5fd',
        },
        gold: {
          900: '#451a03',
          800: '#78350f',
          700: '#92400e',
          600: '#b45309',
          500: '#d97706',
          400: '#f59e0b',
          300: '#fbbf24',
          200: '#fde68a',
          100: '#fef3c7',
        },
        ink: {
          DEFAULT: '#F8F8FF',
          muted: '#9BA3B5',
          subtle: '#4B5568',
          ghost: 'rgba(248,248,255,0.06)',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          border: 'rgba(255,255,255,0.08)',
          hover: 'rgba(255,255,255,0.09)',
          strong: 'rgba(255,255,255,0.12)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124, 58, 237, 0.3), transparent)',
        'violet-gold': 'linear-gradient(135deg, #7C3AED 0%, #F59E0B 100%)',
        'violet-gold-soft': 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(245,158,11,0.15) 100%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'glow-violet': '0 0 40px rgba(124, 58, 237, 0.25)',
        'glow-gold': '0 0 40px rgba(245, 158, 11, 0.25)',
        'glow-sm': '0 0 20px rgba(124, 58, 237, 0.15)',
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset',
        'card-hover': '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.3)',
        'premium': '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'orbit': 'orbit 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
