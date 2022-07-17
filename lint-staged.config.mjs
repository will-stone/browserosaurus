export default {
  '*.{css,json,md}': ['prettier --write'],
  '*.{js,jsx,ts,tsx,cjs,mjs}': ['eslint --fix'],
}
