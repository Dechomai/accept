module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: ['react', 'jest'],
  globals: {
    ENV: false,
    BUILD_INFO: false,
    BLOCKCHAIN_TOKEN_CONTRACT_ADDRESS: false
  },
  rules: {
    'no-console': 1,
    'react/prop-types': [1, {ignore: ['children']}]
  }
};
