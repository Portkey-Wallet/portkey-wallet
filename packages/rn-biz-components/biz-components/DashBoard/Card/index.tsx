import React, { useMemo } from 'react';
import { View, Text, StyleProp, ViewProps } from 'react-native';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { styles } from './style';
import SendButton from '@portkey-wallet/rn-components/components/SendButton';
import ReceiveButton from '@portkey-wallet/rn-components/components/ReceiveButton';
import ActivityButton from '../ActivityButton';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useQrScanPermissionAndToast } from '@portkey-wallet/rn-base/hooks/useQrScan';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAccountBalanceUSD } from '@portkey-wallet/hooks/hooks-ca/balances';
import FaucetButton from '@portkey-wallet/rn-components/components/FaucetButton';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import DepositButton from '@portkey-wallet/rn-components/components/DepositButton';
import { DepositItem, useDepositList } from '@portkey-wallet/rn-base/hooks/deposit';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import { formatAmountUSDShow } from '@portkey-wallet/utils/converter';
import CustomHeader from '@portkey-wallet/rn-components/components/CustomHeader';

const Card: React.FC = () => {
  const isMainnet = useIsMainnet();
  const userInfo = useCurrentUserInfo();
  const accountBalanceUSD = useAccountBalanceUSD();
  const depositList = useDepositList();
  const isDepositShow = useMemo(() => !!depositList.length, [depositList.length]);
  const buttonCount = useMemo(() => {
    let count = 3;
    if (isDepositShow) count++;
    // FaucetButton
    if (!isMainnet) count++;
    return count;
  }, [isDepositShow, isMainnet]);

  const buttonGroupWrapStyle = useMemo(
    () => (buttonCount < 5 ? (GStyles.flexCenter as StyleProp<ViewProps>) : undefined),
    [buttonCount],
  );
  const buttonWrapStyle = useMemo(
    () => (buttonCount < 5 ? (styles.buttonWrapStyle1 as StyleProp<ViewProps>) : undefined),
    [buttonCount],
  );

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
        {isDepositShow && <DepositButton wrapStyle={buttonWrapStyle} list={depositList as DepositItem[]} />}
        <SendButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
        <ReceiveButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
        {!isMainnet && <FaucetButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />}
        <ActivityButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
      </View>
    </View>
  );
};

export default Card;
