import { useCallback } from 'react';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { removeManager } from 'utils/sandboxUtil/removeManager';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { handleErrorMessage } from '@portkey-wallet/utils';
import useLogOut from 'hooks/useLogout';
import { DEVICE_TYPE } from 'constants/index';
import getSeed from 'utils/getSeed';
import singleMessage from 'utils/singleMessage';

export function useExitWallet() {
  const wallet = useCurrentWalletInfo();
  const originChainId = useOriginChainId();

  const currentChain = useCurrentChain(originChainId);
  const currentNetwork = useCurrentNetworkInfo();
  const logout = useLogOut();

  const onConfirm = useCallback(async () => {
    try {
      const { privateKey } = await getSeed();
      if (!currentChain?.endPoint || !privateKey) return singleMessage.error('error');
      const result = await removeManager({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey,
        paramsOption: {
          caHash: wallet?.caHash as string,
          managerInfo: {
            address: wallet.address,
            extraData: `${DEVICE_TYPE},${Date.now()}`,
          },
        },
        sendOptions: {
          onMethod: 'transactionHash',
        },
      });
      console.log('removeManager', 'removeManager==result', result);
      logout();
    } catch (error: any) {
      const _error = handleErrorMessage(error, 'Something error');
      singleMessage.error(_error);
    }
  }, [currentChain, currentNetwork.walletType, logout, wallet.address, wallet?.caHash]);

  return {
    exitWallet: onConfirm,
  };
}
