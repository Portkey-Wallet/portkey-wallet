import { NetworkItem } from '@portkey-wallet/types/types-eoa/network';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { useResetStore } from '@portkey-wallet/hooks/hooks-eoa';
import { useLanguage } from 'i18n/hooks';
import ActionSheet from 'components/ActionSheet';
import { request } from '@portkey-wallet/api/api-did';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { useCurrentNetworkInfo, useNetworkList, useSwitchNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useCallback } from 'react';

export function useChangeNetwork() {
  const resetStore = useResetStore();
  const { t } = useLanguage();
  const switchNetwork = useSwitchNetwork();

  const onConfirm = useThrottleCallback(
    async (logged: boolean) => {
      console.log('logged', logged);
      // if (logged) {
      //   routeName = 'Tab';
      // }
      resetStore();
      request.initService();
      switchNetwork();
      signalrFCM.switchNetwork();
    },
    [resetStore, switchNetwork],
  );
  return useThrottleCallback(
    (network: NetworkItem, isShowAlert = true) => {
      // TODO other network logged
      const logged = false;
      const networkName = network.networkType === 'MAINNET' ? 'Mainnet' : 'Testnet';

      if (!isShowAlert) {
        return onConfirm(network, logged);
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
            onPress: () => onConfirm(logged),
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
