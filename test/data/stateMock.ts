export const stateMock = {
  tokenBalance: {
    balances: {
      rpcUrl1: {
        address1: {
          ELF: 'value1',
        },
        address2: {
          ELF: 'value2',
        },
      },
    },
  },
  wallet: {
    accountList: [
      {
        address: 'address1',
      },
      {
        address: 'address2',
      },
    ],
  },
  chain: {
    currentChain: {
      rpcUrl: 'rpcUrl1',
      nativeCurrency: { symbol: 'ELF' },
    },
  },
};
