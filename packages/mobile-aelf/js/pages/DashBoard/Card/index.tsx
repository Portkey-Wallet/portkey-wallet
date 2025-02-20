import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { getStyles } from './style';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useCurrentHideAssetsState, useSetHideAssets } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import FaucetButton from 'components/FaucetButton';
import OutlinedButton from 'components/OutlinedButton';
import BuyButton from 'components/BuyButton';
// import { useAppRampEntryShow } from 'hooks/ramp';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
// import { useAppSwapButtonShow } from 'hooks/cms';
import navigationService from 'utils/navigationService';

const Card: React.FC<{ title: string }> = ({ title }) => {
  const isMainnet = useIsMainnet();
  const hideAssets = useCurrentHideAssetsState();
  const setHideAssets = useSetHideAssets();
  // const { isRampShow } = useAppRampEntryShow();
  // const { isSwapShow } = useAppSwapButtonShow();
  const isRampShow = false;
  const isSwapShow = true;
  const styles = getStyles();
  const buttonCount = useMemo(() => {
    let count = 2;
    if (isSwapShow) {
      count++;
    }
    if (isRampShow) {
      count++;
    }
    if (!isMainnet) {
      count++;
    } // faucet
    return count;
  }, [isMainnet, isRampShow, isSwapShow]);

  const buttonWrapStyle: StyleProp<ViewStyle> = useMemo(() => {
    switch (buttonCount) {
      case 2:
        return styles.buttonContainerGap3;
      case 3:
        return styles.buttonContainerGap2;
      case 4:
        return styles.buttonContainerGap1;

      default:
        return undefined;
    }
  }, [buttonCount, styles]);

  const onHideAssets = useCallback(() => {
    setHideAssets(!hideAssets);
  }, [setHideAssets, hideAssets]);

  const onReceivePress = useCallback(() => {
    navigationService.navigate('ReceiveSelectToken');
  }, []);

  return (
    <View style={[styles.cardWrap]}>
      <View style={styles.textColumn}>
        {title ? (
          <View style={styles.usdtBalanceWrap}>
            <Text style={[styles.usdtBalance, hideAssets && { letterSpacing: pTd(3.2) }]}>
              {hideAssets ? '******' : title}
            </Text>
            {isMainnet && (
              <TouchableOpacity onPress={onHideAssets}>
                <Svg icon={hideAssets ? 'eyeClosed' : 'eye'} size={pTd(24)} iconStyle={styles.eyeIcon} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.titleLoading} />
        )}
      </View>
      <View style={styles.buttonGroupWrap}>
        <SendButton
          themeType="dashBoard"
          buttonWrapStyle={styles.buttonWrap}
          containerStyle={[styles.buttonContainer, buttonWrapStyle, styles.buttonContainer1st]}
        />
        <ReceiveButton
          onPress={onReceivePress}
          buttonWrapStyle={styles.buttonWrap}
          containerStyle={[styles.buttonContainer, buttonWrapStyle]}
        />
        {isRampShow && (
          <BuyButton
            wrapStyle={buttonWrapStyle}
            buttonWrapStyle={styles.buttonWrap}
            containerStyle={[styles.buttonContainer, buttonWrapStyle]}
          />
        )}
        {isSwapShow && (
          <OutlinedButton
            title="Swap"
            iconName="swap"
            containerStyle={[styles.buttonContainer, buttonWrapStyle]}
            buttonWrapStyle={styles.buttonWrap}
            onPress={() => {
              navigationService.navigate('SwapHome');
            }}
          />
        )}
        {!isMainnet && (
          <FaucetButton
            containerStyle={[styles.buttonContainer, buttonWrapStyle]}
            buttonWrapStyle={styles.buttonWrap}
          />
        )}
      </View>
    </View>
  );
};

export default Card;
