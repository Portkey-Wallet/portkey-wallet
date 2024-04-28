import React, { memo, useMemo } from 'react';
import Svg from '../Svg';
import navigationService from '@portkey-wallet/rn-inject-sdk';

import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from '../CommonText';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useStyles } from '../SendButton/style';
import Touchable from '../Touchable';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  wrapStyle?: StyleProp<ViewProps>;
  tokenInfo: TokenItemShowType;
}

const BuyButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard', wrapStyle = {}, tokenInfo } = props;
  const isMainnet = useIsMainnet();
  const { t } = useLanguage();
  const commonButtonStyle = useStyles();

  const buttonTitleStyle = useMemo(
    () =>
      themeType === 'dashBoard'
        ? commonButtonStyle.dashBoardTitleColorStyle
        : commonButtonStyle.innerPageTitleColorStyle,
    [themeType],
  );

  return (
    <View style={[commonButtonStyle.buttonWrap, wrapStyle]}>
      <Touchable
        style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter]}
        onPress={async () => {
          if (!isMainnet) return;
          navigationService.navigate('RampHome', { symbol: tokenInfo.symbol });
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'buy' : 'buy2'} size={pTd(46)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, buttonTitleStyle]}>{t('Buy')}</TextM>
    </View>
  );
};

export default memo(BuyButton);
