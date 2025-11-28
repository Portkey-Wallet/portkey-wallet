import { NetworkItem } from '@portkey-wallet/types/types-eoa/network';
import { useAppCommonDispatch, useThrottleCallback } from '@portkey-wallet/hooks';
import { useResetStore } from '@portkey-wallet/hooks/hooks-eoa';
import { useLanguage } from 'i18n/hooks';
import ActionSheet from 'components/ActionSheet';
import { request } from '@portkey-wallet/api/api-did';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { useCurrentNetworkInfo, useNetworkList, useSwitchNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useCallback } from 'react';
import { initNetworkDiscoverMap } from '@portkey-wallet/store/store-eoa/discover/slice';
import { resetDapp } from '@portkey-wallet/store/store-eoa/dapp/actions';

export function useChangeNetwork() {
  const resetStore = useResetStore();
  const { t } = useLanguage();
  const switchNetwork = useSwitchNetwork();
  const dispatch = useAppCommonDispatch();

  const onConfirm = useThrottleCallback(
    async (network: NetworkItem) => {
      dispatch(resetDapp());
      dispatch(initNetworkDiscoverMap(network.networkType));
      resetStore();
      request.initService();
      switchNetwork();
      signalrFCM.switchNetwork();
    },
    [dispatch, resetStore, switchNetwork],
  );
  return useThrottleCallback(
    (network: NetworkItem, isShowAlert = true) => {
      const networkName = network.networkType === 'MAINNET' ? 'Mainnet' : 'Testnet';

      if (!isShowAlert) {
        return onConfirm(network);
      }

      ActionSheet.alert({
        showInfoIcon: true,
        title: t('Confirm network switch'),
        message: t(
          `Your account on the current network cannot be used on aelf ${networkName}. You'll need to register a new account or log in to your existing ${networkName} account.`,
          {
            title: networkName,
          },
        ),
        buttons: [
          { title: 'Cancel', type: 'outline' },
          {
            title: 'Confirm',
            onPress: () => onConfirm(network),
          },
        ],
      });
    },
    [onConfirm, t],
  );
}

export function useChangeNetworkDirectly() {
  const currentNetworkInfo = useCurrentNetworkInfo();
  const networkList = useNetworkList();
  const changeNetwork = useChangeNetwork();

  return useCallback(() => {
    const targetNetwork = networkList.find(network => network.name !== currentNetworkInfo.name);
    changeNetwork(targetNetwork, false);
  }, [changeNetwork, currentNetworkInfo.name, networkList]);
}
