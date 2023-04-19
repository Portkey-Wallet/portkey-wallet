jest.mock('@portkey-wallet/socket/socket-did');
jest.mock('@portkey-wallet/utils');
jest.mock('@portkey-wallet/hooks/hooks-ca/network');

import { renderHook } from '@testing-library/react';
import { useFetchWalletCAAddress } from './wallet-result';
import Socket from '@portkey-wallet/socket/socket-did';
import * as walletUtils from '@portkey-wallet/api/api-did/utils/wallet';
import { useCurrentApiUrl } from '@portkey-wallet/hooks/hooks-ca/network';
import { VerificationType } from '@portkey-wallet/types/verifier';

describe('useFetchWalletCAAddress', () => {
  test('recovery success', async () => {
    jest.mocked(useCurrentApiUrl).mockReturnValue('https://explorer.aelf.io/chain');
    const remove = () => jest.fn();
    jest.spyOn(Socket, 'onCaAccountRegister').mockReturnValue({ remove });
    jest.spyOn(Socket, 'onCaAccountRecover').mockReturnValue({ remove });
    jest
      .spyOn(walletUtils, 'requestCreateWallet')
      .mockReturnValueOnce(Promise.resolve({ registerStatus: 'pending' }))
      .mockReturnValue(Promise.resolve({ registerStatus: 'success' }));

    const { result } = renderHook(() => useFetchWalletCAAddress());
    const walletResult = await result.current({
      clientId: 'AELF',
      requestId: '',
      verificationType: VerificationType.register,
      managerUniqueId: '',
    });

    expect(result.current).toBeEnabled;
    expect(walletResult.status).toBe('success');
  });

  test('recovery success', async () => {
    jest.mocked(useCurrentApiUrl).mockReturnValue('https://explorer.aelf.io/chain');
    const remove = () => jest.fn();
    jest.spyOn(Socket, 'onCaAccountRegister').mockReturnValue({ remove });
    jest.spyOn(Socket, 'onCaAccountRecover').mockReturnValue({ remove });
    jest.spyOn(walletUtils, 'requestCreateWallet').mockReturnValue(Promise.resolve({ recoveryStatus: 'success' }));

    const { result } = renderHook(() => useFetchWalletCAAddress());
    const walletResult = await result.current({
      clientId: 'AELF',
      requestId: '',
      verificationType: VerificationType.communityRecovery,
      managerUniqueId: '',
    });

    expect(result.current).toBeEnabled;
    expect(walletResult.status).toBe('success');
  });
});
