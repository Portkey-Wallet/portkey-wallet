import React, { memo, useMemo } from 'react';
import Svg from 'components/Svg';
import navigationService from 'utils/navigationService';

import { View, TouchableOpacity, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { commonButtonStyle } from '../SendButton/style';

interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  wrapStyle?: StyleProp<ViewProps>;
}

const BuyButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard', wrapStyle = {} } = props;
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
      <TouchableOpacity
        style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter]}
        onPress={async () => {
          if (!isMainnet) return;
          navigationService.navigate('BuyHome');
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'buy' : 'buy1'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={[commonButtonStyle.commonTitleStyle, buttonTitleStyle]}>{t('Buy')}</TextM>
    </View>
  );
};

export default memo(BuyButton);
