import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-figtree)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Design system colors using CSS variables
        'surface-primary': 'var(--color-surface-primary)',
        'surface-secondary': 'var(--color-surface-secondary)',
        'surface-tertiary': 'var(--color-surface-tertiary)',
        'surface-extra-light': 'var(--color-surface-extra-light)',
        'surface-light': 'var(--color-surface-light)',
        'surface-dark': 'var(--color-surface-dark)',
        'content-primary': 'var(--color-content-primary)',
        'content-inverse': 'var(--color-content-inverse)',
        'content-secondary': 'var(--color-content-secondary)',
        'content-muted': 'var(--color-content-muted)',
        'content-brand': 'var(--color-content-brand)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
