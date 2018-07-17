const ResizeObserver = require('resize-observer-polyfill')

module.exports = {
  globals: {
    ResizeObserver,
  },
  moduleNameMapper: {
    electron: '<rootDir>/mocks/electron.js',
  },
  testPathIgnorePatterns: ['/build/', '/docs/', '/out/'],
}
