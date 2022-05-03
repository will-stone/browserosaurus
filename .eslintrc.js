require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: [
    '@will-stone/eslint-config-base',
    '@will-stone/eslint-config-typescript',
    '@will-stone/eslint-config-node',
    '@will-stone/eslint-config-react',
    '@will-stone/eslint-config-jest',
    '@will-stone/eslint-config-prettier',
  ],
  rules: {
    'unicorn/prefer-top-level-await': 'off',
  },
}
