import { useCallback } from 'react';
import { useAppDispatch, useCommonState } from 'store/Provider/hooks';
import { resetSettings } from '@portkey-wallet/store/settings/slice';
import { resetNetwork } from '@portkey-wallet/store/network/actions';
import { resetCaInfo, resetWallet } from '@portkey-wallet/store/store-ca/wallet/actions';
import { resetToken } from '@portkey-wallet/store/token/slice';
import { resetLoginInfoAction } from 'store/reducers/loginCache/actions';
import { request } from '@portkey-wallet/api/api-did';
import {
  useCurrentWalletInfo,
  useOriginChainId,
  useOtherNetworkLogged,
  useWallet,
} from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getHolderInfoByContract } from 'utils/sandboxUtil/getHolderInfo';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { ManagerInfo } from '@portkey-wallet/graphql/contract/__generated__/types';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';
import { useResetStore } from '@portkey-wallet/hooks/hooks-ca';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useNavigate } from 'react-router';
import { clearLocalStorage } from 'utils/storage/chromeStorage';
import { getWalletInfo, isCurrentCaHash } from 'store/utils/getStore';
import { resetDappList } from '@portkey-wallet/store/store-ca/dapp/actions';

export default function useLogOut() {
  const dispatch = useAppDispatch();
  const { currentNetwork } = useWallet();
  const resetStore = useResetStore();
  const { isPrompt } = useCommonState();
  const navigate = useNavigate();
  const otherNetworkLogged = useOtherNetworkLogged();

  return useCallback(async () => {
    try {
      resetStore();
      if (otherNetworkLogged) {
        dispatch(resetCaInfo(currentNetwork));
      } else {
        dispatch(resetWallet());
        dispatch(resetToken());
        dispatch(resetSettings());
        dispatch(resetNetwork());
        dispatch(resetLoginInfoAction());
        clearLocalStorage();
      }
      dispatch(resetDappList(currentNetwork));

      if (!isPrompt) {
        InternalMessage.payload(PortkeyMessageTypes.LOGIN_WALLET).send();
      } else {
        navigate('/register');
      }
      request.initService();
      setTimeout(() => {
        request.initService();
      }, 2000);
    } catch (error) {
      console.log(error, '====error');
    }
  }, [currentNetwork, dispatch, isPrompt, navigate, otherNetworkLogged, resetStore]);
}

export function useCheckManager() {
  const originChainId = useOriginChainId();
  const chain = useCurrentChain(originChainId);
  const network = useCurrentNetworkInfo();
  return useCallback(
    async ({ caHash, address }: { caHash: string; address: string }) => {
      if (!chain) throw 'Can not get chain info';
      const info = await getHolderInfoByContract({
        rpcUrl: chain.endPoint,
        chainType: network.walletType,
        address: chain.caContractAddress,
        paramsOption: {
          caHash,
        },
      });
      if (info.result) {
        const { managerInfos } = info.result as { managerInfos: ManagerInfo[] };
        return managerInfos?.some((manager) => manager?.address === address);
      }
      throw new Error('caHash does not exist');
    },
    [chain, network.walletType],
  );
}

export function useCheckManagerOnLogout() {
  const { caHash, address } = useCurrentWalletInfo();

  const checkManager = useCheckManager();
  const logout = useLogOut();
  return useLockCallback(async () => {
    if (!caHash) return;
    try {
      const isManager = await checkManager({ caHash, address });
      const walletInfo = getWalletInfo();
      if (!isManager && walletInfo?.address === address && isCurrentCaHash(caHash)) logout();
    } catch (error) {
      console.log(error, '======error');
      const msg = handleErrorMessage(error);
      message.error(msg);
    }
  }, [address, caHash, logout]);
}
