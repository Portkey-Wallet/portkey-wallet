import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { useOriginChainId, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { changeNetworkType, setWalletNameAction } from '@portkey-wallet/store/store-ca/wallet/actions';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useCommonState } from 'store/Provider/hooks';
import { useResetStore } from '@portkey-wallet/hooks/hooks-ca';
import closeOpenTabs from 'utils/clearOpenTabs';
import { sleep } from '@portkey-wallet/utils';

export function useChangeNetwork() {
  const dispatch = useAppDispatch();
  const { walletInfo } = useWallet();
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const originChainId = useOriginChainId();
  const resetStore = useResetStore();

  return useCallback(
    async (network: NetworkItem) => {
      const { caInfo } = walletInfo || {};
      const tmpCaInfo = caInfo?.[network.networkType];
      resetStore();
      dispatch(setWalletNameAction('Wallet 01'));
      dispatch(changeNetworkType(network.networkType));
      if (tmpCaInfo?.managerInfo && tmpCaInfo?.[originChainId]?.caAddress) {
        await closeOpenTabs(true);
        if (!isPrompt) {
          await sleep(500);
          InternalMessage.payload(PortkeyMessageTypes.EXPAND_FULL_SCREEN).send();
        } else {
          navigate('/');
        }
      } else {
        if (!isPrompt) {
          await sleep(1000);
          InternalMessage.payload(PortkeyMessageTypes.REGISTER_START_WALLET).send();
        } else {
          navigate('/register/start');
        }
      }
    },
    [walletInfo, originChainId, resetStore, dispatch, isPrompt, navigate],
  );
}
