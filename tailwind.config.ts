import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1180px' } },
    extend: {
      colors: {
        bg: '#050816',
        surface: '#0B1023',
        card: '#111827',
        line: 'rgba(148,163,184,0.12)',
        'line-strong': 'rgba(148,163,184,0.20)',
        ink: { DEFAULT: '#EAEEF7', muted: '#94A3B8', dim: '#5D6B85' },
        accent: { blue: '#4F7DF9', purple: '#8B5CF6', emerald: '#10B981' },

        /* Private app (/us). A separate, warmer scale so the portfolio's
           cool palette above is never touched. */
        us: {
          bg: '#0A090B',
          surface: '#100E12',
          card: '#16131A',
          raised: '#1D1922',
          line: 'rgba(236,220,216,0.09)',
          'line-strong': 'rgba(236,220,216,0.17)',
          ink: '#F3EEEC',
          muted: '#A79B9A',
          dim: '#6E6467',
          rose: '#D08C86',
          'rose-soft': 'rgba(208,140,134,0.13)',
          sage: '#89AE94',
          amber: '#D6A45C',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
      },
      letterSpacing: { tightest: '-0.045em', tighter: '-0.035em', label: '0.2em' },
      borderRadius: { xl: '16px', '2xl': '22px', '3xl': '24px' },
      boxShadow: {
        lift: '0 30px 60px -34px rgba(0,0,0,0.95)',
        glow: '0 10px 26px -12px rgba(79,125,249,0.9)',
        portrait: '0 40px 90px -40px rgba(0,0,0,0.9)',
      },
      keyframes: {
        ripple: { '0%': { r: '3', opacity: '0.75' }, '70%,100%': { r: '16', opacity: '0' } },
        breathe: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.45' } },
        'us-rise': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'us-pulse': {
          '0%,100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.35)' },
        },
        'us-seal': {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '60%': { opacity: '1', transform: 'scale(1.01)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        ripple: 'ripple 3.2s ease-out infinite',
        breathe: 'breathe 2.6s ease-in-out infinite',
        'us-rise': 'us-rise 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'us-pulse': 'us-pulse 2.8s ease-in-out infinite',
        'us-seal': 'us-seal 0.7s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
