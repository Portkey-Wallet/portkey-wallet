import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { changeNetworkType } from '@portkey-wallet/store/store-ca/wallet/actions';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'navigation';
import { useAppDispatch } from 'store/hooks';
import navigationService, { NavigateName } from 'utils/navigationService';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { useResetStore } from '@portkey-wallet/hooks/hooks-ca';
import { useLanguage } from 'i18n/hooks';
import ActionSheet from 'components/ActionSheet';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import im from '@portkey-wallet/im';
import { request } from '@portkey-wallet/api/api-did';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCallback } from 'react';

const STAY_ROUTE_NAMES: NavigateName[] = ['LoginEmail', 'SignUpEmail', 'LoginQRCode'];
export function useChangeNetwork(route: RouteProp<ParamListBase>) {
  const dispatch = useAppDispatch();
  const wallet = useWallet();

  const resetStore = useResetStore();
  const { t } = useLanguage();
  const onConfirm = useThrottleCallback(
    async (network: NetworkItem, logged: boolean) => {
      let routeName: keyof RootStackParamList = 'LoginPortkey';
      if (logged) {
        routeName = 'Tab';
      }
      resetStore();
      request.initService();
      im.destroy();
      dispatch(changeNetworkType(network.networkType));
      signalrFCM.switchNetwork();

      if (
        routeName !== route.name &&
        !(routeName === 'LoginPortkey' && STAY_ROUTE_NAMES.includes(route.name as NavigateName))
      ) {
        navigationService.reset(routeName);
      }
    },
    [dispatch, resetStore, route.name],
  );
  return useThrottleCallback(
    (network: NetworkItem, isShowAlert = true) => {
      const { walletInfo, originChainId } = wallet;
      const { caInfo } = walletInfo || {};
      const tmpCaInfo = caInfo?.[network.networkType];
      const tmpChainId = tmpCaInfo?.originChainId || originChainId || DefaultChainId;
      const logged = tmpCaInfo?.managerInfo && tmpCaInfo[tmpChainId]?.caAddress;
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
            onPress: () => onConfirm(network, logged),
          },
        ],
      });
    },
    [wallet, onConfirm, t],
  );
}

export function useChangeNetworkDirectly(route: RouteProp<ParamListBase>) {
  const currentNetworkInfo = useCurrentNetworkInfo();
  const networkList = useNetworkList();
  const changeNetwork = useChangeNetwork(route);

  return useCallback(() => {
    const targetNetwork = networkList.find(network => network.name !== currentNetworkInfo.name);
    changeNetwork(targetNetwork, false);
  }, [changeNetwork, currentNetworkInfo.name, networkList]);
}
