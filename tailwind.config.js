const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    fontSize: {
      xxs: '.6rem',
      xs: '.75rem',
      sm: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    fontFamily: {
      sans: 'SF Pro Text, Helvetica, Arial, sans-serif',
      rounded: 'SF Pro Rounded, Helvetica, Arial, sans-serif',
    },
    extend: {
      colors: {
        'grey-200': '#C6CCD7',
        'grey-300': '#A9B2C3',
        'grey-400': '#848C9B',
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
    boxShadow: ['responsive', 'hover', 'focus', 'active'],
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
