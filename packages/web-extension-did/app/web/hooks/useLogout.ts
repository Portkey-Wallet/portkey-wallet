import { useCallback } from 'react';
import { useAppDispatch, useCommonState } from 'store/Provider/hooks';
import { resetSettings } from '@portkey-wallet/store/settings/slice';
import { resetNetwork } from '@portkey-wallet/store/network/actions';
import { reSetCheckManagerExceed, resetCaInfo, resetWallet } from '@portkey-wallet/store/store-ca/wallet/actions';
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
import { useCurrentChain, useGetChainInfo } from '@portkey-wallet/hooks/hooks-ca/chainList';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { ManagerInfo } from '@portkey-wallet/graphql/contract/__generated__/types';
import { handleErrorMessage, sleep } from '@portkey-wallet/utils';
import { useResetStore } from '@portkey-wallet/hooks/hooks-ca';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes, { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useNavigate } from 'react-router';
import { getWalletInfo, isCurrentCaHash } from 'store/utils/getStore';
import { resetDappList } from '@portkey-wallet/store/store-ca/dapp/actions';
import { resetTxFee } from '@portkey-wallet/store/store-ca/txFee/actions';
import im from '@portkey-wallet/im';
import { resetIm } from '@portkey-wallet/store/store-ca/im/actions';
import { resetDisclaimerConfirmedDapp } from '@portkey-wallet/store/store-ca/discover/slice';
import { resetSecurity } from '@portkey-wallet/store/store-ca/security/actions';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { unRegisterFCM } from 'utils/FCM';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import singleMessage from 'utils/singleMessage';
import { ChainId } from '@portkey/provider-types';
import { useLatestRef } from '@portkey-wallet/hooks';
import { useMiscSetting } from '@portkey-wallet/hooks/hooks-ca/misc';

export default function useLogOut() {
  const dispatch = useAppDispatch();
  const { currentNetwork } = useWallet();
  const resetStore = useResetStore();
  const { isPrompt } = useCommonState();
  const navigate = useNavigate();
  const otherNetworkLogged = useOtherNetworkLogged();
  const isShowChat = useIsChatShow();
  const { resetCurrentNetworkSetting } = useMiscSetting();

  return useCallback(async () => {
    try {
      if (isShowChat) {
        unRegisterFCM();
      }
      resetStore();
      im.destroy();
      dispatch(resetIm(currentNetwork));
      dispatch(resetDisclaimerConfirmedDapp(currentNetwork));
      dispatch(resetSecurity(currentNetwork));
      dispatch(reSetCheckManagerExceed(currentNetwork));
      signalrFCM.exitWallet();
      resetCurrentNetworkSetting();
      if (otherNetworkLogged) {
        dispatch(resetCaInfo(currentNetwork));
      } else {
        dispatch(resetWallet());
        dispatch(resetToken());
        dispatch(resetSettings());
        dispatch(resetNetwork());
        dispatch(resetLoginInfoAction());
        InternalMessage.payload(InternalMessageTypes.CLEAR_SEED).send();
      }
      dispatch(resetDappList(currentNetwork));
      dispatch(resetTxFee(currentNetwork));

      if (!isPrompt) {
        await sleep(500);
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
  }, [
    currentNetwork,
    dispatch,
    isPrompt,
    isShowChat,
    navigate,
    otherNetworkLogged,
    resetStore,
    resetCurrentNetworkSetting,
  ]);
}

export function useCheckManager() {
  const originChainId = useOriginChainId();
  const originChainInfo = useCurrentChain(originChainId);
  const network = useCurrentNetworkInfo();
  const getChainInfo = useGetChainInfo();
  return useCallback(
    async ({ chainId, caHash, address }: { caHash: string; address: string; chainId?: ChainId }) => {
      let chainInfo = originChainInfo;
      if (chainId) chainInfo = await getChainInfo(chainId);
      if (!chainInfo) throw 'Can not get chain info';
      const info = await getHolderInfoByContract({
        rpcUrl: chainInfo.endPoint,
        chainType: network.walletType,
        address: chainInfo.caContractAddress,
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
    [originChainInfo, network.walletType, getChainInfo],
  );
}

export function useCheckManagerOnLogout() {
  const { caHash, address } = useCurrentWalletInfo();
  const originChainId = useOriginChainId();
  const latestOriginChainId = useLatestRef(originChainId);
  const checkManager = useCheckManager();
  const logout = useLogOut();
  return useLockCallback(async () => {
    if (!caHash) return;
    try {
      const isManager = await checkManager({ caHash, address, chainId: latestOriginChainId.current });
      const walletInfo = getWalletInfo();
      if (!isManager && walletInfo?.address === address && isCurrentCaHash(caHash)) logout();
    } catch (error) {
      console.log(error, '======error');
      const msg = handleErrorMessage(error);
      singleMessage.error(msg);
    }
  }, [address, caHash, checkManager, latestOriginChainId, logout]);
}
