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
import { useIsTestnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAccountBalanceUSD } from '@portkey-wallet/hooks/hooks-ca/balances';

const Card: React.FC = () => {
  const { t } = useLanguage();
  const isTestnet = useIsTestnet();
  const { walletName } = useWallet();
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
      <Text style={styles.usdtBalance}>{isTestnet ? 'Dev Mode' : `$${accountBalanceUSD}`}</Text>
      <TextM style={styles.accountName}>{walletName}</TextM>
      <View style={styles.buttonGroupWrap}>
        <BuyButton themeType="dashBoard" />
        <SendButton themeType="dashBoard" />
        <ReceiveButton themeType="dashBoard" />
        <ActivityButton themeType="dashBoard" />
      </View>
    </View>
  );
};

export default Card;
