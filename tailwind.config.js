const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    fontFamily: {
      sans: 'SF Pro Text, Helvetica, Arial, sans-serif',
      rounded: 'SF Pro Rounded, Helvetica, Arial, sans-serif',
    },
    extend: {
      colors: {
        'grey-200': '#C6CCD7',
        'grey-300': '#A9B2C3',
        'grey-500': '#5F6672',
        'grey-600': '#2F333B',
        'grey-700': '#212428',
        'grey-800': '#1A1D21',
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
