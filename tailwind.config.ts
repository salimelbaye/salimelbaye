import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

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
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: { tightest: '-0.045em', tighter: '-0.035em', label: '0.2em' },
      borderRadius: { xl: '16px', '2xl': '22px', '3xl': '24px' },
      boxShadow: {
        lift: '0 30px 60px -34px rgba(0,0,0,0.95)',
        glow: '0 10px 26px -12px rgba(79,125,249,0.9)',
        portrait: '0 40px 90px -40px rgba(0,0,0,0.9)',
      },
      keyframes: {
        breathe: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.45' } },
      },
      animation: {
        breathe: 'breathe 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
};
export default config;
