import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { NetworkType } from '@portkey-wallet/types';
import { useCallback } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';

export default function useChangeNetworkText() {
  const originChainId = useOriginChainId();
  const { walletInfo } = useWalletInfo();
  return useCallback(
    (network: NetworkType) => {
      const { caInfo } = walletInfo || {};
      const tmpCaInfo = caInfo?.[network];
      const hasTargetCa = tmpCaInfo?.managerInfo && tmpCaInfo?.[originChainId]?.caAddress;
      const networkText = network === 'TESTNET' ? 'Testnet' : 'Mainnet';
      const title = 'You are about to switch to';
      let content = `Your account on the current network can not be used on aelf ${networkText}, so you will need to register a new account or log in to your existing ${networkText} account there.`;
      if (hasTargetCa) {
        content = `After confirmation, you will enter the ${networkText}.`;
      }
      return {
        title,
        content,
      };
    },
    [originChainId, walletInfo],
  );
}
