import { DappManager } from '@portkey-wallet/utils/dapp/dappManager';
import { DappMobileManager } from 'dapp/dappManager';
import { store } from 'store';
import {} from 'react-native';

describe('DappManager', () => {
  test('init well', () => {
    const manager: DappManager = new DappMobileManager({ store: store as any });
    expect(manager).toBeTruthy();
  });
});
