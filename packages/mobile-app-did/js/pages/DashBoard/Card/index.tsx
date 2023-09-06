import React, { useCallback, useMemo } from 'react';
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
import FaucetButton from 'components/FaucetButton';
import { useBuyButtonShow, useIsBridgeShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import BridgeButton from 'components/BridgeButton';
import GStyles from 'assets/theme/GStyles';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

const Card: React.FC = () => {
  const { t } = useLanguage();
  const isMainnet = useIsMainnet();
  const { walletName } = useWallet();
  const accountBalanceUSD = useAccountBalanceUSD();
  const [, requestQrPermission] = useQrScanPermission();
  const { isBuyButtonShow } = useBuyButtonShow(isIOS ? VersionDeviceType.iOS : VersionDeviceType.Android);

  //  TODO:
  const isShowBridgeButton = true;
  // const isShowBridgeButton = useIsBridgeShow(isIOS ? VersionDeviceType.iOS : VersionDeviceType.Android);

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

  const buttonCount = useMemo(() => {
    let count = 3;
    if (isBuyButtonShow) count++;
    if (isShowBridgeButton) count++;
    // FaucetButton
    if (!isMainnet) count++;
    return count;
  }, [isBuyButtonShow, isMainnet, isShowBridgeButton]);

  const buttonGroupWrapStyle = useMemo(() => {
    if (buttonCount >= 5) {
      // styles
      return {};
    } else {
      return GStyles.flexCenter;
    }
  }, [buttonCount]);

  const buttonWrapStyle = useMemo(() => {
    if (buttonCount >= 5) {
      return {};
    } else {
      return styles.buttonWrapStyle1;
    }
  }, [buttonCount]);

  return (
    <View style={[styles.cardWrap]}>
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

      <View style={[GStyles.flexRow, GStyles.spaceBetween, styles.buttonGroupWrap, buttonGroupWrapStyle]}>
        {isBuyButtonShow && <BuyButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />}
        {isShowBridgeButton && <BridgeButton wrapStyle={buttonWrapStyle} />}
        <SendButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
        <ReceiveButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
        {!isMainnet && <FaucetButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />}
        <ActivityButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
      </View>
    </View>
  );
};

export default Card;
