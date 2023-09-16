import { FlatCompat } from '@eslint/eslintrc'
import config from '@will-stone/eslint-config'

const compat = new FlatCompat()

export default [
  {
    ignores: ['.webpack/'],
  },
  ...config,
  ...compat.extends('plugin:tailwindcss/recommended'),
  {
    files: ['**/*.tsx'],
    rules: {
      'tailwindcss/no-custom-classname': [
        'warn',
        { whitelist: ['draggable', 'no-drag'] },
      ],
    },
  },
]
