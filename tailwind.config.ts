import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',          // make sure this line exists
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '380px',           // add this inside extend
      },
    },
  },
  plugins: [],
}

export default config
