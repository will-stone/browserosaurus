export default {
  '*.{css,json,md}': ['prettier --write'],
  '*.{js,jsx,ts,tsx,cjs,mjs}': [
    'cross-env ESLINT_USE_FLAT_CONFIG=true eslint -c eslint.config.mjs --fix',
  ],
}
