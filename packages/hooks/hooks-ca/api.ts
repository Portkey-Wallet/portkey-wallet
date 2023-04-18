import { useMemo } from 'react';
import { useCurrentNetworkInfo } from './network';
import { useCurrentWalletInfo, useOriginChainId } from './wallet';
import aes from '@portkey-wallet/utils/aes';
import AElf from 'aelf-sdk';
import { setRefreshTokenConfig } from '@portkey-wallet/api/api-did/utils';

export function useRefreshTokenConfig(pin?: string) {
  const { caHash, AESEncryptPrivateKey } = useCurrentWalletInfo();
  const { connectUrl } = useCurrentNetworkInfo();
  const originChainId = useOriginChainId();
  useMemo(() => {
    if (!caHash || !AESEncryptPrivateKey || !pin) return;
    const privateKey = aes.decrypt(AESEncryptPrivateKey, pin);
    if (!privateKey) return;
    const account = AElf.wallet.getWalletByPrivateKey(privateKey);
    setRefreshTokenConfig({
      account,
      caHash,
      connectUrl,
      chainId: originChainId,
    });
  }, [AESEncryptPrivateKey, pin, caHash, connectUrl, originChainId]);
}
