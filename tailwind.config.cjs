const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'media',
  mode: 'jit',
  purge: ['./src/**/*.tsx', './src/**/*.html'],
  theme: {
    colors: {
      gray: colors.gray,
      blueGray: colors.blueGray,
      white: colors.white,
      black: colors.black,
      yellow: colors.yellow,
      blue: colors.blue,
    },
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
  ],
}
