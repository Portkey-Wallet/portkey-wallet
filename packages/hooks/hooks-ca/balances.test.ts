import { useCurrentNetworkBalances, useAccountBalanceUSD } from './balances';
import { renderHookWithProvider } from '../../../test/utils/render';
import { setupStore } from '../../../test/utils/setup';

describe('useCurrentNetworkBalances', () => {
  test('rpcUrl undefined, and return undefined', () => {
    const state = {
      tokenBalance: {
        balances: {
          rpcUrl1: {
            address1: {
              ELF: 'value1',
            },
          },
        },
      },
      chain: {
        currentChain: {
          rpcUrl: undefined,
        },
      },
    };

    const { result } = renderHookWithProvider(useCurrentNetworkBalances, setupStore(state));

    expect(result.current).toBeUndefined();
  });
  test('balances undefined, and return undefined', () => {
    const state = {
      tokenBalance: {
        balances: undefined,
      },
      chain: {
        currentChain: {
          rpcUrl: 'rpcUrl1',
        },
      },
    };

    const { result } = renderHookWithProvider(useCurrentNetworkBalances, setupStore(state));

    expect(result.current).toBeUndefined();
  });
  test('all data defined, and return an object', () => {
    const state = {
      tokenBalance: {
        balances: {
          rpcUrl1: {
            address1: {
              ELF: 'value1',
            },
          },
        },
      },
      chain: {
        currentChain: {
          rpcUrl: 'rpcUrl1',
        },
      },
    };

    const { result } = renderHookWithProvider(useCurrentNetworkBalances, setupStore(state));

    expect(result.current).toHaveProperty('address1', { ELF: 'value1' });
  });
  test('balances[currentNetwork.rpcUrl] undefined, and return undefined', () => {
    const state = {
      tokenBalance: {
        balances: {
          rpcUrl1: {
            address1: {
              ELF: 'value1',
            },
          },
        },
      },
      chain: {
        currentChain: {
          rpcUrl: 'rpcUrl2',
        },
      },
    };

    const { result } = renderHookWithProvider(useCurrentNetworkBalances, setupStore(state));

    expect(result.current).toBeUndefined();
  });
});

describe('useAccountBalanceUSD', () => {
  test('all data defined, and return successfully', () => {
    const state = {
      assets: {
        accountToken: {
          accountTokenList: [
            {
              chainId: 'AELF',
              symbol: 'ELF',
              balance: 24858795000,
              decimals: 8,
            },
            {
              chainId: 'tDVV',
              symbol: 'ELF',
              balance: 2895000000,
              decimals: 8,
            },
          ],
        },
        tokenPrices: {
          tokenPriceObject: {
            ELF: 0.311933,
          },
        },
      },
    };

    const { result } = renderHookWithProvider(useAccountBalanceUSD, setupStore(state));
    expect(result.current).toBe('86.57');
  });
});
