import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleProp, ViewProps, TouchableOpacity } from 'react-native';
import { getStyles } from './style';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentUserInfo, useSetHideAssets } from '@portkey-wallet/hooks/hooks-ca/wallet';
import FaucetButton from 'components/FaucetButton';
import GStyles from 'assets/theme/GStyles';
import SwapButton from 'components/SwapButton';
import BuyButton from 'components/BuyButton';
import { useAppRampEntryShow } from 'hooks/ramp';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useAppSwapButtonShow } from 'hooks/cms';
import navigationService from 'utils/navigationService';

const Card: React.FC<{ title: string }> = ({ title }) => {
  const isMainnet = useIsMainnet();
  const userInfo = useCurrentUserInfo();
  const setHideAssets = useSetHideAssets();
  const { isRampShow } = useAppRampEntryShow();
  const { isSwapShow } = useAppSwapButtonShow();
  const styles = getStyles();
  const buttonCount = useMemo(() => {
    let count = 2;
    if (isSwapShow) count++;
    if (isRampShow) count++;
    if (!isMainnet) count++; // faucet
    return count;
  }, [isMainnet, isRampShow, isSwapShow]);

  const buttonWrapStyle = useMemo(
    () => (buttonCount < 5 ? (styles.buttonWrapStyle1 as StyleProp<ViewProps>) : undefined),
    [buttonCount, styles],
  );

  const onHideAssets = useCallback(() => {
    setHideAssets(!userInfo.hideAssets);
  }, [setHideAssets, userInfo.hideAssets]);

  const onReceivePress = useCallback(() => {
    navigationService.navigate('ReceiveSelectToken');
  }, []);

  return (
    <View style={[styles.cardWrap]}>
      <View style={styles.textColumn}>
        {title ? (
          <View style={styles.usdtBalanceWrap}>
            <Text style={[styles.usdtBalance, userInfo.hideAssets && { letterSpacing: pTd(3.2) }]}>
              {userInfo.hideAssets ? '******' : title}
            </Text>
            {isMainnet && (
              <TouchableOpacity onPress={onHideAssets}>
                <Svg icon={userInfo.hideAssets ? 'eyeClosed' : 'eye'} size={pTd(24)} iconStyle={styles.eyeIcon} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.titleLoading} />
        )}
      </View>
      <View style={[GStyles.flexRow, GStyles.spaceBetween, styles.buttonGroupWrap]}>
        <SendButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
        <ReceiveButton onPress={onReceivePress} />
        {isRampShow && <BuyButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />}
        {/* {isSwapShow && <SwapButton />} */}
        {!isMainnet && <FaucetButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />}
      </View>
    </View>
  );
};

export default Card;
