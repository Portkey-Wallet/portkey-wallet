import React, { useMemo } from 'react';
import { View, Text, StyleProp, ViewProps } from 'react-native';
import { styles } from './style';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import ActivityButton from 'pages/DashBoard/ActivityButton';
import { TextM } from 'components/CommonText';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import FaucetButton from 'components/FaucetButton';
import GStyles from 'assets/theme/GStyles';
import DepositButton from 'components/DepositButton';
import BuyButton from 'components/BuyButton';
import { useAppRampEntryShow } from 'hooks/ramp';
import { useAppETransShow } from 'hooks/cms';

const Card: React.FC<{ title: string }> = ({ title }) => {
  const isMainnet = useIsMainnet();
  const userInfo = useCurrentUserInfo();
  const { isETransDepositShow } = useAppETransShow();
  const { isRampShow } = useAppRampEntryShow();
  const buttonCount = useMemo(() => {
    let count = 3;
    if (isETransDepositShow) count++;
    if (isRampShow) count++;
    if (!isMainnet) count++; // faucet
    return count;
  }, [isETransDepositShow, isMainnet, isRampShow]);

  const buttonGroupWrapStyle = useMemo(
    () => (buttonCount < 5 ? (GStyles.flexCenter as StyleProp<ViewProps>) : undefined),
    [buttonCount],
  );
  const buttonWrapStyle = useMemo(
    () => (buttonCount < 5 ? (styles.buttonWrapStyle1 as StyleProp<ViewProps>) : undefined),
    [buttonCount],
  );

  const { eTransferUrl = '' } = useCurrentNetworkInfo();

  return (
    <View style={[styles.cardWrap]}>
      <View style={styles.textColumn}>
        <TextM style={styles.accountName}>{userInfo?.nickName}</TextM>
        <Text style={styles.usdtBalance}>{title}</Text>
      </View>
      <View style={[GStyles.flexRow, GStyles.spaceBetween, styles.buttonGroupWrap, buttonGroupWrapStyle]}>
        <SendButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
        <ReceiveButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
        {isRampShow && <BuyButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />}
        {isETransDepositShow && <DepositButton wrapStyle={buttonWrapStyle} depositUrl={eTransferUrl} />}
        {!isMainnet && <FaucetButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />}
        <ActivityButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
      </View>
    </View>
  );
};

export default Card;
