import React, { memo, useMemo } from 'react';
import CommonSvg from 'components/Svg';

import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { commonButtonStyle } from '../SendButton/style';
import Touchable from 'components/Touchable';
import { dashBoardBtnStyle } from '../SendButton/style';
import { innerPageStyles } from './style';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { RampType } from '@portkey-wallet/ramp';

interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  wrapStyle?: StyleProp<ViewProps>;
}

const BuyButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard', wrapStyle = {} } = props;
  const { t } = useLanguage();
  const { navigateTo } = useBaseContainer({
    entryName: PortkeyEntries.TOKEN_DETAIL_ENTRY,
  });

  const buttonTitleStyle = useMemo(
    () =>
      themeType === 'dashBoard'
        ? commonButtonStyle.dashBoardTitleColorStyle
        : commonButtonStyle.innerPageTitleColorStyle,
    [themeType],
  );

  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;

  return (
    <View style={[styles.buttonWrap, wrapStyle]}>
      <Touchable
        style={[styles.iconWrapStyle, GStyles.alignCenter]}
        onPress={async () => {
          navigateTo(PortkeyEntries.RAMP_HOME_ENTRY, {
            params: {
              toTab: RampType.BUY,
            },
          });
        }}>
        <CommonSvg icon={themeType === 'dashBoard' ? 'buy' : 'buy1'} size={pTd(46)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, buttonTitleStyle]}>{t('Buy')}</TextM>
    </View>
  );
};

export default memo(BuyButton);
