const { FlatCompat } = require('@eslint/eslintrc')

const compat = new FlatCompat()

module.exports = [
  ...compat.extends(
    '@will-stone/eslint-config-base',
    '@will-stone/eslint-config-typescript',
    '@will-stone/eslint-config-node',
    '@will-stone/eslint-config-react',
    '@will-stone/eslint-config-jest',
    '@will-stone/eslint-config-prettier',
    'plugin:tailwindcss/recommended',
  ),
  {
    files: ['**/*.tsx'],
    rules: {
      'tailwindcss/no-custom-classname': [
        'warn',
        { whitelist: ['draggable', 'no-drag'] },
      ],
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'unicorn/prefer-top-level-await': 'off',
    },
  },
]
