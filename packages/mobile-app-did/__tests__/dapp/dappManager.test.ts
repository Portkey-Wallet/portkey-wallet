import { DappManager } from '@portkey-wallet/utils/dapp/dappManager';
import { DappMobileManager } from 'dapp/dappManager';
import { ChainsInfo } from '@portkey/provider-types';
import { ChainId } from '@portkey-wallet/types';
import { store } from 'store';

describe('DappManager', () => {
  let manager: DappManager;
  const mockOrigin = 'you-know-who';
  test('init well', () => {
    manager = new DappMobileManager({ store: store as any });
    expect(manager).toBeTruthy();
  });
  test('getState', () => {
    expect(manager.getState()).toBeTruthy();
  });
  test('isLocked default:true', async () => {
    expect(await manager.isLocked()).toBe(true);
  });
  test('generate chainIds/chainsInfo/RpcUrl/Accounts successfully', async () => {
    const chains: Array<ChainId> = await manager.chainId();
    expect(Array.isArray(chains) && chains[0]).toBeTruthy();
    const chainsInfo: ChainsInfo = await manager.chainsInfo();
    expect(chainsInfo.AELF || chainsInfo.tDVV || chainsInfo.tDVW).toBeTruthy();
    const rpcUrl: string | undefined = await manager.getRpcUrl(chains[0]);
    expect(rpcUrl && rpcUrl?.length > 0).toBeTruthy();
  });
  test('unknown origin will be blocked', async () => {
    const accounts = await manager.accounts(mockOrigin);
    expect(accounts).toEqual({});
  });
});
