import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { resetSettings } from '@portkey-wallet/store/settings/slice';

import navigationService from 'utils/navigationService';
import { resetNetwork } from '@portkey-wallet/store/network/actions';

import { resetCaInfo, resetWallet } from '@portkey-wallet/store/store-ca/wallet/actions';
import { resetUser } from 'store/user/actions';

import { resetGuardians } from '@portkey-wallet/store/store-ca/guardians/actions';
import { request } from '@portkey-wallet/api/api-did';

import { useGetCurrentCAViewContract } from './contract';
import {
  useCurrentWalletInfo,
  useOriginChainId,
  useOtherNetworkLogged,
  useWallet,
} from '@portkey-wallet/hooks/hooks-ca/wallet';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { ManagerInfo } from '@portkey-wallet/graphql/contract/__generated__/types';
import { useResetStore } from '@portkey-wallet/hooks/hooks-ca';
import { useGetChainInfo } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey-wallet/types';
import { getWalletInfo, isCurrentCaHash } from 'utils/redux';
import { resetDappList } from '@portkey-wallet/store/store-ca/dapp/actions';
import { changeDrawerOpenStatus, resetDiscover } from '@portkey-wallet/store/store-ca/discover/slice';

export default function useLogOut() {
  const dispatch = useAppDispatch();
  const { currentNetwork } = useWallet();
  const resetStore = useResetStore();
  const otherNetworkLogged = useOtherNetworkLogged();

  return useCallback(() => {
    try {
      resetStore();
      dispatch(resetDappList(currentNetwork));
      dispatch(resetDiscover(currentNetwork));
      dispatch(changeDrawerOpenStatus(false));

      if (otherNetworkLogged) {
        dispatch(resetCaInfo(currentNetwork));
        navigationService.reset('LoginPortkey');
      } else {
        dispatch(resetWallet());
        dispatch(resetUser());
        dispatch(resetSettings());
        dispatch(resetNetwork());
        dispatch(resetGuardians());
        navigationService.reset('Referral');
        setTimeout(() => {
          request.initService();
        }, 2000);
      }
      request.initService();
    } catch (error) {
      console.log(error, '====error');
    }
  }, [currentNetwork, dispatch, otherNetworkLogged, resetStore]);
}

export function useCheckManager() {
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  const getChainInfo = useGetChainInfo();
  return useCallback(
    async ({ chainId, caHash, address }: { chainId?: ChainId; caHash: string; address: string }) => {
      let chainInfo;
      if (chainId) chainInfo = await getChainInfo(chainId);
      const caContract = await getCurrentCAViewContract(chainInfo);
      const info = await caContract?.callViewMethod('GetHolderInfo', { caHash });
      if (info) {
        const { managerInfos } = info.data as { managerInfos: ManagerInfo[] };
        return managerInfos?.some(manager => manager?.address === address);
      }
      throw new Error('caHash does not exist');
    },
    [getChainInfo, getCurrentCAViewContract],
  );
}

export function useCheckManagerOnLogout() {
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  const checkManager = useCheckManager();
  const { caHash, address } = useCurrentWalletInfo();
  const originChainId = useOriginChainId();
  const logout = useLogOut();
  return useLockCallback(async () => {
    if (!caHash) return;
    try {
      const isManager = await checkManager({ caHash, address, chainId: originChainId });
      const walletInfo = getWalletInfo();
      if (!isManager && walletInfo?.address === address && isCurrentCaHash(caHash)) logout();
    } catch (error) {
      console.log(error, '======error-useCheckManagerOnLogout');
    }
  }, [address, caHash, getCurrentCAViewContract, logout, originChainId]);
}
