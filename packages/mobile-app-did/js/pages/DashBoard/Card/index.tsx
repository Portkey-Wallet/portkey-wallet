import React, { useMemo } from 'react';
import { View, Text, StyleProp, ViewProps } from 'react-native';
import { styles } from './style';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import ActivityButton from 'pages/DashBoard/ActivityButton';
import { TextM } from 'components/CommonText';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAccountBalanceUSD } from '@portkey-wallet/hooks/hooks-ca/balances';
import FaucetButton from 'components/FaucetButton';
import GStyles from 'assets/theme/GStyles';
import DepositButton from 'components/DepositButton';
import { formatAmountUSDShow } from '@portkey-wallet/utils/converter';
import CustomHeader from 'components/CustomHeader';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import navigationService from 'utils/navigationService';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import BuyButton from 'components/BuyButton';

const Card: React.FC = () => {
  const isMainnet = useIsMainnet();
  const userInfo = useCurrentUserInfo();
  const accountBalanceUSD = useAccountBalanceUSD();
  const buttonCount = useMemo(() => {
    return 5;
  }, []);

  const buttonGroupWrapStyle = useMemo(
    () => (buttonCount < 5 ? (GStyles.flexCenter as StyleProp<ViewProps>) : undefined),
    [buttonCount],
  );
  const buttonWrapStyle = useMemo(
    () => (buttonCount < 5 ? (styles.buttonWrapStyle1 as StyleProp<ViewProps>) : undefined),
    [buttonCount],
  );
  const { eTransferUrl = '' } = useCurrentNetworkInfo();

  const qrScanPermissionAndToast = useQrScanPermissionAndToast();

  const RightDom = useMemo(
    () => (
      <Touchable
        style={styles.svgWrap}
        onPress={async () => {
          if (!(await qrScanPermissionAndToast())) return;
          navigationService.navigate('QrScanner');
        }}>
        <Svg icon="scan" size={pTd(22)} color={defaultColors.bg31} />
      </Touchable>
    ),
    [qrScanPermissionAndToast],
  );

  return (
    <View style={[styles.cardWrap]}>
      <CustomHeader noLeftDom rightDom={RightDom} themeType="white" titleDom={''} />

      <View style={styles.textColumn}>
        <TextM style={styles.accountName}>{userInfo?.nickName}</TextM>
        <Text style={styles.usdtBalance}>{isMainnet ? formatAmountUSDShow(accountBalanceUSD) : 'Dev Mode'}</Text>
      </View>
      <View style={[GStyles.flexRow, GStyles.spaceBetween, styles.buttonGroupWrap, buttonGroupWrapStyle]}>
        <SendButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
        <ReceiveButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
        {isMainnet && <BuyButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />}
        <DepositButton wrapStyle={buttonWrapStyle} depositUrl={eTransferUrl} />
        {!isMainnet && <FaucetButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />}
        <ActivityButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
      </View>
    </View>
  );
};

export default Card;
