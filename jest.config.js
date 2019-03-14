module.exports = {
  setupFilesAfterEnv: ['react-testing-library/cleanup-after-each', 'jest-dom/extend-expect'],
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/docs/', '<rootDir>/out/'],
}
