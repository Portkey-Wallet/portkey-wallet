import React, { memo, useCallback } from 'react';
import Svg from 'components/Svg';
import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { commonButtonStyle } from '../SendButton/style';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import {
  DEFAULT_DEPOSIT_TO_TOKEN_MAINNET,
  DEFAULT_DEPOSIT_TO_TOKEN_TESTNET,
} from '@portkey-wallet/constants/constants-ca/deposit';

type DepositButtonPropsType = {
  wrapStyle?: StyleProp<ViewProps>;
};

const DepositButton = (props: DepositButtonPropsType) => {
  const { t } = useLanguage();
  const { accountTokenList } = useAccountTokenInfo();
  const isMainnet = useIsMainnet();
  const { wrapStyle } = props;

  const onPress = useCallback(() => {
    const defaultToToken = isMainnet ? DEFAULT_DEPOSIT_TO_TOKEN_MAINNET : DEFAULT_DEPOSIT_TO_TOKEN_TESTNET;
    const toToken = accountTokenList.find(
      item => item.symbol === defaultToToken.symbol && item.chainId === defaultToToken.chainId,
    );
    navigationService.navigate('Deposit', toToken ?? defaultToToken);
  }, [accountTokenList, isMainnet]);

  return (
    <View style={[commonButtonStyle.buttonWrap, wrapStyle]}>
      <Touchable style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter]} onPress={onPress}>
        <Svg icon="depositMain" size={pTd(48)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, commonButtonStyle.dashBoardTitleColorStyle]}>
        {t('Deposit')}
      </TextM>
    </View>
  );
};

export default memo(DepositButton);
