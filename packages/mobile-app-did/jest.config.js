/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    __DEV__: true,
  },
  transform: {
    '^.+\\.(ts|tsx)$': [`ts-jest`, { isolatedModules: true, tsconfig: './tsconfig.json' }],
  },
  moduleNameMapper: {
    '^utils/(.*)$': '<rootDir>/js/utils/$1',
    '^store/(.*)$': '<rootDir>/js/store/$1',
    '^@portkey-wallet/store/(.*)$': '<rootDir>/../store/$1',
    store: '<rootDir>/js/store/index',
    '^dapp/(.*)$': '<rootDir>/js/dapp/$1',
  },
  testEnvironment: 'react-native',
  setupFilesAfterEnv: ['./jest-setup/mockAsyncStorage.ts'],
};
