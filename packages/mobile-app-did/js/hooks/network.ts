import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { changeNetworkType } from '@portkey-wallet/store/store-ca/wallet/actions';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'navigation';
import { useAppDispatch } from 'store/hooks';
import navigationService from 'utils/navigationService';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { useResetStore } from '@portkey-wallet/hooks/hooks-ca';
import { useLanguage } from 'i18n/hooks';
import ActionSheet from 'components/ActionSheet';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network-testnet';

export function useChangeNetwork(route: RouteProp<ParamListBase>) {
  const dispatch = useAppDispatch();
  const wallet = useWallet();

  const resetStore = useResetStore();
  const { t } = useLanguage();
  const onConfirm = useThrottleCallback(
    async (network: NetworkItem, logged: boolean) => {
      let routeName: keyof RootStackParamList = 'LoginPortkey';
      if (logged) routeName = 'Tab';
      resetStore();
      dispatch(changeNetworkType(network.networkType));
      if (routeName !== route.name && !(routeName === 'LoginPortkey' && route.name === 'SignupPortkey'))
        navigationService.reset(routeName);
    },
    [dispatch, route.name],
  );
  return useThrottleCallback(
    (network: NetworkItem) => {
      const { walletInfo, originChainId } = wallet;
      const { caInfo } = walletInfo || {};
      const tmpCaInfo = caInfo?.[network.networkType];
      const tmpChainId = tmpCaInfo?.originChainId || originChainId || DefaultChainId;
      const logged = tmpCaInfo?.managerInfo && tmpCaInfo[tmpChainId]?.caAddress;
      const networkName = network.networkType === 'MAIN' ? 'Mainnet' : 'Testnet';
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
    [wallet, onConfirm],
  );
}
