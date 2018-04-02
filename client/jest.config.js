module.exports = {
  // define globals, mocks, etc.
  setupFiles: ['./test/fetchMock', './test/setup'],

  // setup test framework
  // eg. change test framework configurations, add custom matchers, etc.
  setupTestFrameworkScriptFile: './test/setupFramework',

  // define globals
  globals: {
    ENV: 'development'
  },

  reporters: ['default'],

  testMatch: [
    '**/__tests__/**/?(*.)(spec|test).js', // match all *.test.js files in __tests__ folders
    '**/?(*.)(spec|test).js' // match all other *.test.js files
  ],

  transform: {
    '\\.(js|jsx)$': 'babel-jest'
  },

  moduleNameMapper: {
    '\\.(s?css|sass|less)$': 'identity-obj-proxy'
  },

  collectCoverageFrom: ['src/**/*.js'],

  coverageDirectory: './reports/coverage',

  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/assets' // all assets(fonts, images, and possible js files)
  ],

  coverageReporters: ['text-summary', 'lcov', 'cobertura', 'clover']

  // testResultsProcessor: 'jest-sonar-reporter'
};
