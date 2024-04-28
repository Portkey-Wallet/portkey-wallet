import { useCallback } from 'react';
import { useAppDispatch } from '../store-app/hooks';

import navigationService from '@portkey-wallet/rn-inject-sdk';

import { reSetCheckManagerExceed } from '@portkey-wallet/store/store-ca/wallet/actions';
import { resetUser } from '../store/user/actions';

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
import { useLogoutResetStore, useResetStore } from '@portkey-wallet/hooks/hooks-ca';
import { useGetChainInfo } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey-wallet/types';
import { getWalletInfo, isCurrentCaHash } from '../utils/redux';
import { resetDappList } from '@portkey-wallet/store/store-ca/dapp/actions';
import {
  changeDrawerOpenStatus,
  resetDiscover,
  resetDisclaimerConfirmedDapp,
} from '@portkey-wallet/store/store-ca/discover/slice';
import im from '@portkey-wallet/im';
import { resetIm } from '@portkey-wallet/store/store-ca/im/actions';
import { resetSecurity } from '@portkey-wallet/store/store-ca/security/actions';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { deleteFCMToken } from '../utils/FCM';
import { resetBadge } from '../utils/notifee';
import { useLatestRef } from '@portkey-wallet/hooks';
import { useMiscSetting } from '@portkey-wallet/hooks/hooks-ca/misc';

export default function useLogOut() {
  const dispatch = useAppDispatch();
  const { currentNetwork } = useWallet();
  const resetStore = useResetStore();
  const logoutResetStore = useLogoutResetStore();
  const otherNetworkLogged = useOtherNetworkLogged();
  const { resetCurrentNetworkSetting } = useMiscSetting();

  return useCallback(() => {
    try {
      resetStore();
      dispatch(resetDappList(currentNetwork));
      dispatch(resetDiscover(currentNetwork));
      dispatch(resetDisclaimerConfirmedDapp(currentNetwork));

      dispatch(changeDrawerOpenStatus(false));
      im.destroy();
      signalrFCM.exitWallet();

      dispatch(resetIm(currentNetwork));
      dispatch(resetSecurity(currentNetwork));
      dispatch(reSetCheckManagerExceed(currentNetwork));
      resetCurrentNetworkSetting();
      logoutResetStore();
      if (otherNetworkLogged) {
        navigationService.reset('LoginPortkey');
      } else {
        resetBadge();
        deleteFCMToken();
        dispatch(resetUser());
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
  }, [currentNetwork, dispatch, logoutResetStore, otherNetworkLogged, resetCurrentNetworkSetting, resetStore]);
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
  const checkManager = useCheckManager();
  const { caHash, address } = useCurrentWalletInfo();
  const originChainId = useOriginChainId();
  const latestOriginChainId = useLatestRef(originChainId);
  const logout = useLogOut();
  return useLockCallback(async () => {
    if (!caHash) return;
    try {
      const isManager = await checkManager({ caHash, address, chainId: latestOriginChainId.current });
      const walletInfo = getWalletInfo();
      if (!isManager && walletInfo?.address === address && isCurrentCaHash(caHash)) logout();
    } catch (error) {
      console.log(error, '======error-useCheckManagerOnLogout');
    }
  }, [address, caHash, checkManager, latestOriginChainId, logout]);
}
