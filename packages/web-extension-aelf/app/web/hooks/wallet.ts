import { useCallback } from 'react';
import { useGetChainInfo } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getHolderInfoByContract } from 'utils/sandboxUtil/getHolderInfo';
import { useAppDispatch } from 'store/Provider/hooks';
import { ChainId } from '@portkey/provider-types';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { ManagerInfo } from '@portkey-wallet/graphql/contract/__generated__/types';
import { updateCASyncState } from '@portkey-wallet/store/store-ca/wallet/actions';

export const useCheckManagerSyncState = () => {
  const getChainInfo = useGetChainInfo();
  const walletInfo = useCurrentWalletInfo();
  const dispatch = useAppDispatch();
  const networkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (chainId: ChainId) => {
      try {
        const currentCaInfo = walletInfo?.[chainId];
        if (!currentCaInfo) return false;
        if (currentCaInfo?.isSync) return true;
        const chainInfo = await getChainInfo(chainId);
        const info = await getHolderInfoByContract({
          rpcUrl: chainInfo.endPoint,
          chainType: networkInfo.walletType,
          address: chainInfo.caContractAddress,
          paramsOption: {
            caHash: currentCaInfo.caHash,
          },
        });
        if (!info.result) return false;
        const { managerInfos } = info.result as { managerInfos: ManagerInfo[] };
        if (managerInfos.some((item) => item.address === walletInfo.address)) {
          dispatch(updateCASyncState({ chainId }));
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    [dispatch, getChainInfo, networkInfo.walletType, walletInfo],
  );
};
