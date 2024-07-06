module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(ts|tsx)?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  rootDir: '.',
};
