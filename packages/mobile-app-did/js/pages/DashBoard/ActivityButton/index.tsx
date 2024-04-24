import React, { memo, useMemo } from 'react';
import { commonButtonStyle } from 'components/SendButton/style';
import navigationService from 'utils/navigationService';
import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';

interface ActivityButtonProps {
  themeType?: 'dashBoard' | 'innerPage';
  wrapStyle?: StyleProp<ViewProps>;
}

const ActivityButton = (props: ActivityButtonProps) => {
  const { themeType = 'dashBoard', wrapStyle = {} } = props;
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
        onPress={() => {
          return navigationService.navigate('ActivityListPage');
        }}>
        <Svg icon={'activity'} size={48} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, buttonTitleStyle]}>{t('Activity')}</TextM>
    </View>
  );
};

export default memo(ActivityButton);
