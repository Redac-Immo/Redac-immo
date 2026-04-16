import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream:    '#FAFAF7',
        dark:     '#18181A',
        dark2:    '#222224',
        dark3:    '#2A2A2C',
        gold:     '#C9A96E',
        'gold-l': '#E8D0A0',
        'gold-d': '#8a6f42',
        mid:      '#6B6B65',
        light:    '#E8E8E4',
        bg2:      '#F2F2EE',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['var(--font-dm-sans)',   'DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'label': ['10px', { letterSpacing: '0.18em' }],
      },
    },
  },
  plugins: [],
}

export default config
