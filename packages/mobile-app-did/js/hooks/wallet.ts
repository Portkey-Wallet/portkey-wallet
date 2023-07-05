import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { useCallback } from 'react';
import { useGetChainInfo } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useGetHolderInfoByViewContract } from './guardian';
import { useAppDispatch } from 'store/hooks';
import { updateCASyncState } from '@portkey-wallet/store/store-ca/wallet/actions';
export const useCheckManagerSyncState = () => {
  const getHolderInfoByViewContract = useGetHolderInfoByViewContract();
  const getChainInfo = useGetChainInfo();
  const walletInfo = useCurrentWalletInfo();
  const dispatch = useAppDispatch();
  return useCallback(
    async (chainId: ChainId) => {
      try {
        const currentCaInfo = walletInfo?.[chainId];

        if (!currentCaInfo) return false;
        if (currentCaInfo?.isSync) return true;
        const chainInfo = await getChainInfo(chainId);
        const info = await getHolderInfoByViewContract({ caHash: currentCaInfo.caHash }, chainInfo);

        if (info.error) return false;

        const { managerInfos }: { managerInfos: { address: string }[] } = info.data;
        if (managerInfos.some(item => item.address === walletInfo.address)) {
          dispatch(updateCASyncState({ chainId }));
          return true;
        }

        return false;
      } catch (error) {
        return false;
      }
    },
    [dispatch, getChainInfo, getHolderInfoByViewContract, walletInfo],
  );
};
