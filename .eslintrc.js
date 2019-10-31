module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser to use TS.
  extends: [
    'eslint:recommended', // Standard eslint rules.
    'plugin:react/recommended', // React specific linting rules.
    'plugin:@typescript-eslint/recommended', // Allows for TypeScript-specific linting rules to run.
    'prettier/@typescript-eslint', // Disables ESLint rules that might conflict with prettier.
    'plugin:prettier/recommended', // Runs prettier as an ESLint rule.
    'prettier/react',
  ],
  settings: {
    react: {
      version: 'detect', // Automatically picks the version you have installed.
    },
  },
  env: {
    // Global variables:
    browser: true,
    node: true,
    es6: true,
    'jest/globals': true, // Allows "it", "describe" etc.
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'jest',
    'react-hooks',
    'simple-import-sort',
  ], // provides extra rules.
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features.
    sourceType: 'module', // Allows for the use of imports.
  },
  rules: {
    'prettier/prettier': ['error'],
    'react/prop-types': 'off', // Disable prop-types as TS is used for type checking.
    '@typescript-eslint/explicit-function-return-type': 'off', // Allows functional components, should be fixed soon: https://github.com/typescript-eslint/typescript-eslint/issues/149
    '@typescript-eslint/explicit-member-accessibility': 'off', // Allows not having to set public/private on class properties.
    'no-var': 'error', // Must use const or let.
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-object-literal-type-assertion': 'off', // allows 'a' payloads
    'simple-import-sort/sort': 'error',
  },
}
