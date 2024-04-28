import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { changeNetworkType } from '@portkey-wallet/store/store-ca/wallet/actions';
import { ParamListBase, RouteProp } from '@portkey-wallet/rn-inject-sdk';
// import { RootStackParamList } from 'navigation';
import { useAppDispatch } from '../store-app/hooks';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { useResetStore } from '@portkey-wallet/hooks/hooks-ca';
import { useLanguage } from '../i18n/hooks';
import ActionSheet from '@portkey-wallet/rn-components/components/ActionSheet';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import im from '@portkey-wallet/im';
import { request } from '@portkey-wallet/api/api-did';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';

export function useChangeNetwork(route: RouteProp<ParamListBase>) {
  const dispatch = useAppDispatch();
  const wallet = useWallet();

  const resetStore = useResetStore();
  const { t } = useLanguage();
  const onConfirm = useThrottleCallback(
    async (network: NetworkItem, logged: boolean) => {
      // let routeName: keyof RootStackParamList = 'LoginPortkey';
      let routeName = 'LoginPortkey';
      if (logged) routeName = 'Tab';
      resetStore();
      request.initService();
      im.destroy();
      dispatch(changeNetworkType(network.networkType));
      signalrFCM.switchNetwork();

      if (routeName !== route.name && !(routeName === 'LoginPortkey' && route.name === 'SignupPortkey'))
        navigationService.reset(routeName);
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

      if (!isShowAlert) return onConfirm(network, logged);

      ActionSheet.alert({
        title: t('You are about to switch to', {
          title: `aelf ${networkName}`,
        }),
        message: t(`${logged ? 'switch network logged message' : 'switch network not logged message'}`, {
          title: networkName,
        }),
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
