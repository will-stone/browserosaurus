module.exports = {
  setupFilesAfterEnv: ['react-testing-library/cleanup-after-each', '<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/docs/', '<rootDir>/out/'],
}
