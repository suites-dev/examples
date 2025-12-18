module.exports = {
  testEnvironment: 'node',
  testRegex: 'tests/.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': ['ts-jest', { isolatedModules: true }]
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/types.ts',
    '!src/schema.ts'
  ]
};


