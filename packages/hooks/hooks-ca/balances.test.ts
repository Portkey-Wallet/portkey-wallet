import { useCurrentNetworkBalances, useAccountListNativeBalances } from './balances';
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
describe('useAccountListNativeBalances', () => {
  test('all data defined, and return an object', () => {
    const state = {
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

    const { result } = renderHookWithProvider(useAccountListNativeBalances, setupStore(state));

    expect(result.current).toHaveProperty('address1', 'value1');
    expect(result.current).toHaveProperty('address2', 'value2');
  });

  test('currentChain and nativeCurrency undefined, return undefined', () => {
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
        currentChain: undefined,
      },
    };

    const { result } = renderHookWithProvider(useAccountListNativeBalances, setupStore(state));

    expect(result.current).toBeUndefined();
  });

  test('currentNetworkBalances undefined, and return undefined', () => {
    const state = {
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
          rpcUrl: undefined,
          nativeCurrency: undefined,
        },
      },
    };

    const { result } = renderHookWithProvider(useAccountListNativeBalances, setupStore(state));

    expect(result.current).toBeUndefined();
  });

  test('accountList undefined, and return empty object', () => {
    const state = {
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
        accountList: undefined,
      },
      chain: {
        currentChain: {
          rpcUrl: 'rpcUrl1',
          nativeCurrency: { symbol: 'ELF' },
        },
      },
    };

    const { result } = renderHookWithProvider(useAccountListNativeBalances, setupStore(state));

    expect(result.current).toMatchObject({});
  });

  test('obj[account.address] undefined, and return an object', () => {
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

    const { result } = renderHookWithProvider(useAccountListNativeBalances, setupStore(state));

    expect(result.current).toHaveProperty('address1', 'value1');
    expect(result.current).toHaveProperty('address2', undefined);
  });
});
