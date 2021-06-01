const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: ['./src/**/*.tsx', './src/**/*.html'],
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
    extend: {
      opacity: { 10: '0.1' },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.4s infinite',
      },
    },
  },
  variants: {
    boxShadow: ['responsive', 'hover', 'focus', 'active'],
    opacity: ['responsive', 'hover', 'focus', 'active'],
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
