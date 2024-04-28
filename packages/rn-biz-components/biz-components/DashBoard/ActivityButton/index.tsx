import React, { memo, useMemo } from 'react';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { useStyles } from '@portkey-wallet/rn-components/components/SendButton/style';
import navigationService from '@portkey-wallet/rn-inject-sdk';

import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';

interface ActivityButtonProps {
  themeType?: 'dashBoard' | 'innerPage';
  wrapStyle?: StyleProp<ViewProps>;
}

const ActivityButton = (props: ActivityButtonProps) => {
  const { themeType = 'dashBoard', wrapStyle = {} } = props;
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
        onPress={() => {
          return navigationService.navigate('ActivityListPage');
        }}>
        <Svg icon={'activity'} size={pTd(48)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, buttonTitleStyle]}>{t('Activity')}</TextM>
    </View>
  );
};

export default memo(ActivityButton);
