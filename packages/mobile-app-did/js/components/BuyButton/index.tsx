import React, { memo, useMemo } from 'react';
import Svg from 'components/Svg';
import navigationService from 'utils/navigationService';

import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { commonButtonStyle } from '../SendButton/style';
import Touchable from 'components/Touchable';
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
