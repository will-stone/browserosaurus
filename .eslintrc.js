module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser to use TS.

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features.
    sourceType: 'module', // Allows for the use of imports.
  },

  extends: [
    'airbnb', // Standard eslint rules.
    'airbnb/hooks', // react hooks
    'plugin:@typescript-eslint/eslint-recommended', // disables rules which are already handled by TypeScript. https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/eslint-recommended.ts
    'plugin:@typescript-eslint/recommended', // TypeScript-specific linting rules.
    'plugin:import/typescript', // fix "Unable to resolve path to module" https://github.com/benmosher/eslint-plugin-import#typescript
    'prettier/@typescript-eslint', // Disables ESLint rules that might conflict with prettier.
    'plugin:prettier/recommended', // Runs prettier as an ESLint rule.
  ],

  // env: {
  //   browser: true,
  //   node: true,
  //   es6: true,
  //   jest: true, // Allows "it", "describe" etc.
  // },

  plugins: ['simple-import-sort'],

  rules: {
    /**
     * Formatting
     */
    'prettier/prettier': 'error',
    /**
     * Import
     */
    'import/prefer-default-export': 'off', // Allow single Named-export
    'simple-import-sort/sort': 'error',
    /**
     * React
     */
    // Only allow JSX in .js and .txs files
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    // No need for prop types with TS
    'react/prop-types': 0,
    /**
     * TypeScript
     */
    // Having to define all return types is too restrictive, especially on React class components.
    // Possible solution has been suggested: https://github.com/typescript-eslint/typescript-eslint/issues/541
    '@typescript-eslint/explicit-function-return-type': 0,
  },
}
