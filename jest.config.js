/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'did',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/packages/hooks/hooks-ca/*.{ts,tsx}',
    '**/packages/store/store-ca/**/slice.{ts,tsx}',
    '**/packages/utils/wallet/index.ts',
    '**/packages/web-extension-did/app/web/store/reducers/**/*.{ts,tsx}',
    '**/packages/web-extension-did/app/web/hooks/useActiveLockStatus.ts',
    '**/packages/web-extension-did/app/web/hooks/useCaInfoOnChain.ts',
    '**/packages/web-extension-did/app/web/hooks/useNetwork.ts',
    '!**/packages/hooks/hooks-ca/contact.{ts,tsx}',
    '!**/node_modules/**',
    '!**/*.test.{ts,tsx}',
  ],
  coverageReporters: ['json-summary'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  projects: [
    {
      displayName: 'hooks',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/packages/hooks/hooks-ca/*.test.{ts,tsx}'],
      testEnvironment: 'jsdom',
    },
    {
      displayName: 'store',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/packages/store/store-ca/**/*.test.{ts,tsx}'],
      testEnvironment: 'jsdom',
    },
    {
      displayName: 'utils',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/packages/utils/**/*.test.{ts,tsx}'],
      testEnvironment: 'jsdom',
    },
    {
      displayName: 'web-extension-did-store',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/packages/web-extension-did/app/web/store/**/*.test.{ts,tsx}'],
      testEnvironment: 'jsdom',
    },
    {
      displayName: 'web-extension-did-hooks',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/packages/web-extension-did/app/web/hooks/*.test.{ts,tsx}'],
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.(ts|tsx)$': [
          `ts-jest`,
          { isolatedModules: true, tsconfig: './packages/web-extension-did/tsconfig.json' },
        ],
      },
      roots: ['<rootDir>/packages/web-extension-did'],
      moduleNameMapper: {
        '^react$': '<rootDir>/node_modules/react',
        '^utils/(.*)$': '<rootDir>/packages/web-extension-did/app/web/utils/$1',
        '^store/(.*)$': '<rootDir>/packages/web-extension-did/app/web/store/$1',
        '^constants/(.*)$': '<rootDir>/packages/web-extension-did/app/web/constants/$1',
        '^messages/(.*)$': '<rootDir>/packages/web-extension-did/app/web/messages/$1',
      },
      coveragePathIgnorePatterns: ['/node_modules/', '/store/', '/hooks-ca/', '/utils/'],
    },
  ],
};
