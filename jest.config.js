module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  rootDir: __dirname,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^tests/(.*)$': '<rootDir>/test/$1'
  },
  testMatch: ['<rootDir>/tests/**/*.spec.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': 'vue-jest'
  },
  testSequencer: '<rootDir>/tests/priority.js',
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover'],
  collectCoverageFrom: ['src/**/*.js', '!src/index.cjs.js']
};
