import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { changeNetworkType, setWalletNameAction } from '@portkey-wallet/store/store-ca/wallet/actions';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useCommonState } from 'store/Provider/hooks';
import { useResetStore } from '@portkey-wallet/hooks/hooks-ca';
import { sleep } from '@portkey-wallet/utils';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import OpenNewTabController from 'controllers/openNewTabController';

export function useChangeNetwork() {
  const dispatch = useAppDispatch();
  const wallet = useWallet();
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const resetStore = useResetStore();

  return useCallback(
    async (network: NetworkItem) => {
      const { walletInfo, originChainId } = wallet || {};
      const { caInfo } = walletInfo || {};
      const tmpCaInfo = caInfo?.[network.networkType];
      const tmpChainId = tmpCaInfo?.originChainId || originChainId || DefaultChainId;

      resetStore();
      dispatch(setWalletNameAction('Wallet 01'));
      dispatch(changeNetworkType(network.networkType));
      if (tmpCaInfo?.managerInfo && tmpCaInfo?.[tmpChainId]?.caAddress) {
        if (!isPrompt) {
          await OpenNewTabController.closeOpenTabs();

          await sleep(500);
          InternalMessage.payload(PortkeyMessageTypes.EXPAND_FULL_SCREEN).send();
        } else {
          await OpenNewTabController.closeOpenTabs(true);

          navigate('/');
        }
      } else {
        if (!isPrompt) {
          await sleep(500);
          InternalMessage.payload(PortkeyMessageTypes.REGISTER_START_WALLET).send();
        } else {
          await OpenNewTabController.closeOpenTabs(true);
          navigate('/register/start');
        }
      }
    },
    [wallet, resetStore, dispatch, isPrompt, navigate],
  );
}
