import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { useOtherNetworkLogged } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { changeNetworkType, setWalletNameAction } from '@portkey-wallet/store/store-ca/wallet/actions';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useCommonState } from 'store/Provider/hooks';
import { useResetStore } from '@portkey-wallet/hooks/hooks-ca';
import { sleep } from '@portkey-wallet/utils';
import OpenNewTabController from 'controllers/openNewTabController';
import im from '@portkey-wallet/im';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';

export function useChangeNetwork() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const resetStore = useResetStore();
  const otherNetworkLogged = useOtherNetworkLogged();

  return useCallback(
    async (network: NetworkItem) => {
      resetStore();
      im.destroy();
      signalrFCM.switchNetwork();
      dispatch(setWalletNameAction(''));
      dispatch(changeNetworkType(network.networkType));
      if (otherNetworkLogged) {
        if (!isPrompt) {
          await sleep(500);
          await InternalMessage.payload(PortkeyMessageTypes.EXPAND_FULL_SCREEN).send();
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
    [resetStore, dispatch, otherNetworkLogged, isPrompt, navigate],
  );
}
