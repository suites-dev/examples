module.exports = {
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: { '.ts': ['ts-jest', { isolatedModules: true } ] },
};
