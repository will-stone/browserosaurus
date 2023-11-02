import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/__mocks__/style-mock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file-mock.js',
  },
  modulePathIgnorePatterns: ['<rootDir>/out/'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest-setup-files-after-environment.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/out/'],
}

export default config
