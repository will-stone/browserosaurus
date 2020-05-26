const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    fontFamily: {
      sans: 'SF Pro Text, Helvetica, Arial, sans-serif',
      rounded: 'SF Pro Rounded, Helvetica, Arial, sans-serif',
    },
    extend: {
      colors: {
        'grey-200': '#C6C6C6',
        'grey-300': '#A9A9A9',
        'grey-500': '#565656',
        'grey-600': '#363636',
        'grey-700': '#252525',
        'grey-800': '#1e1e1e',
        'grey-900': '#0D1117',
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
