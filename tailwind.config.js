const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    fontFamily: {
      sans: 'SF Pro Text, Helvetica, Arial, sans-serif',
      rounded: 'SF Pro Rounded, Helvetica, Arial, sans-serif',
    },
    extend: {
      colors: {
        'grey-50': '#FDFEFE',
        'grey-100': '#F9F9FA',
        'grey-200': '#C1C4CC',
        'grey-300': '#C6C9D1',
        'grey-400': '#A1A4AC',
        'grey-500': '#7A7F88',
        'grey-600': '#555A64',
        'grey-700': '#41464E',
        'grey-800': '#31353D',
        'grey-900': '#1F2123',
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
    textColor: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
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
