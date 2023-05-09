import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import Svg from 'components/Svg';
import { styles } from './style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import ActivityButton from 'pages/DashBoard/ActivityButton';

import { TextM } from 'components/CommonText';
import navigationService from 'utils/navigationService';
import { defaultColors } from 'assets/theme';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useQrScanPermission from 'hooks/useQrScanPermission';
import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';
import BuyButton from 'components/BuyButton';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAccountBalanceUSD } from '@portkey-wallet/hooks/hooks-ca/balances';
import { useIsShowBuy } from 'hooks/useSwitchBuy';
import FaucetButton from 'components/FaucetButton';

const Card: React.FC = () => {
  const { t } = useLanguage();
  const isMainnet = useIsMainnet();
  const { walletName } = useWallet();
  const isShowBuy = useIsShowBuy();
  const accountBalanceUSD = useAccountBalanceUSD();
  const [, requestQrPermission] = useQrScanPermission();

  const showDialog = useCallback(
    () =>
      ActionSheet.alert({
        title: t('Enable Camera Access'),
        message: t('Cannot connect to the camera. Please make sure it is turned on'),
        buttons: [
          {
            title: t('Close'),
            type: 'solid',
          },
        ],
      }),
    [t],
  );

  return (
    <View style={styles.cardWrap}>
      <View style={styles.refreshWrap}>
        <Text style={styles.block} />
        <TouchableOpacity
          style={styles.svgWrap}
          onPress={async () => {
            if (!(await requestQrPermission())) return showDialog();
            navigationService.navigate('QrScanner');
          }}>
          <Svg icon="scan" size={22} color={defaultColors.font2} />
        </TouchableOpacity>
      </View>
      <Text style={styles.usdtBalance}>{isMainnet ? `$${accountBalanceUSD}` : 'Dev Mode'}</Text>
      <TextM style={styles.accountName}>{walletName}</TextM>
      <View style={styles.buttonGroupWrap}>
        {isMainnet && isShowBuy && (
          <>
            <BuyButton themeType="dashBoard" />
            <View style={styles.spacerStyle} />
          </>
        )}
        <SendButton themeType="dashBoard" />
        <View style={styles.spacerStyle} />
        <ReceiveButton themeType="dashBoard" />
        <View style={styles.spacerStyle} />
        {!isMainnet && (
          <>
            <FaucetButton themeType="dashBoard" />
            <View style={styles.spacerStyle} />
          </>
        )}
        <ActivityButton themeType="dashBoard" />
      </View>
    </View>
  );
};

export default Card;
