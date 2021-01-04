module.exports = {
   "modulePaths": [
      '<rootDir>',
      '<rootDir>/node_modules/jose/'
    ],
   testPathIgnorePatterns: [
      '<rootDir>/bin/',
      '<rootDir>/node_modules/'
   ],
   moduleNameMapper: {
      "^jose/(.*)$": "<rootDir>/node_modules/jose/dist/node/cjs/$1"
    },
  preset: 'ts-jest',
  testEnvironment: 'node',
};