import { useCallback } from 'react';
import { useCurrentNetworkInfo } from './network';
import { useCurrentWalletInfo, useOriginChainId } from './wallet';
import aes from '@portkey-wallet/utils/aes';
import AElf from 'aelf-sdk';
import { setRefreshTokenConfig } from '@portkey-wallet/api/api-did/utils';

export function useRefreshTokenConfig() {
  const { caHash, AESEncryptPrivateKey } = useCurrentWalletInfo();
  const { connectUrl } = useCurrentNetworkInfo();
  const originChainId = useOriginChainId();
  return useCallback(
    async (pin?: string) => {
      if (!caHash || !AESEncryptPrivateKey || !pin) return;
      const privateKey = aes.decrypt(AESEncryptPrivateKey, pin);
      if (!privateKey) return;
      const account = AElf.wallet.getWalletByPrivateKey(privateKey);
      return await setRefreshTokenConfig({
        account,
        caHash,
        connectUrl,
        chainId: originChainId,
      });
    },
    [caHash, AESEncryptPrivateKey, connectUrl, originChainId],
  );
}
