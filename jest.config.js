module.exports = {
  roots: ['<rootDir>/lib'],
  collectCoverageFrom: ['<rootDir>/lib/**/*.ts', '!**/*.integ.ts', '!**/index.ts'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      statements: 90,
    },
  },
};
