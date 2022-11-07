// @ts-check

/* eslint-disable sort-keys -- too many keys need to be naturally sorted */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx', './src/**/*.html'],
  theme: {
    fontSize: {
      'xxs': '.6rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont',
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.draggable': {
          '-webkit-app-region': 'drag',
        },
      })
    }),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.no-drag': {
          '-webkit-user-drag': 'none',
        },
      })
    }),
  ],
}
