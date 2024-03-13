import React, { memo, useCallback, useRef } from 'react';
import CommonSvg from 'components/Svg';
import { dashBoardBtnStyle, innerPageStyles } from './style';
import { TokenItemShowType } from 'packages/types/types-ca/token';
import { View, TouchableOpacity, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import CommonToast from 'components/CommonToast';
import { callFaucetMethod } from 'model/contract/handler';
import { isWalletUnlocked } from 'model/verify/core';
import { getCurrentNetworkType } from 'model/hooks/network';
interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  sentToken?: TokenItemShowType;
  wrapStyle?: StyleProp<ViewProps>;
}

const FaucetButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard', wrapStyle } = props;
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;
  const { t } = useLanguage();

  const isLoading = useRef<boolean>(false);

  const claimToken = useCallback(async () => {
    if (!(await isWalletUnlocked())) return;
    CommonToast.loading('Your ELF is on its way');

    if (isLoading.current) return;
    isLoading.current = true;
    try {
      const rst = await callFaucetMethod();
      if (rst.error) {
        throw rst.error;
      }
      CommonToast.success(`Token successfully requested`);
    } catch (error) {
      console.error(error);
      CommonToast.warn(`Today's limit has been reached`);
    }
    isLoading.current = false;
  }, []);

  return (
    <View style={[styles.buttonWrap, wrapStyle]}>
      <TouchableOpacity
        style={[styles.iconWrapStyle, GStyles.alignCenter]}
        onPress={async () => {
          const networkType = await getCurrentNetworkType();
          if (networkType !== 'TESTNET') return;
          claimToken();
        }}>
        <CommonSvg icon={themeType === 'dashBoard' ? 'faucet' : 'faucet1'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Faucet')}</TextM>
    </View>
  );
};

export default memo(FaucetButton);
