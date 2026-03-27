import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '380px',
      },
      colors: {
        surface: {
          light: '#ffffff',
          dark: '#111827',
        },
        muted: {
          light: '#f3f4f6',
          dark: '#1f2937',
        },
      },
    },
  },
  plugins: [],
}

export default config
