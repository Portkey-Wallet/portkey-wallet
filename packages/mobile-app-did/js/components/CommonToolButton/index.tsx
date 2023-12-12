import React, { memo, useMemo } from 'react';
import Svg, { IconName } from 'components/Svg';
import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { commonButtonStyle } from '../SendButton/style';
import Touchable from 'components/Touchable';

type WithdrawButtonPropsType = {
  wrapStyle?: StyleProp<ViewProps>;
  themeType?: 'dashBoard' | 'innerPage';
  icon: IconName;
  onPress: () => void;
  title: string;
};

const CommonToolButton = (props: WithdrawButtonPropsType) => {
  const { themeType = 'dashBoard', wrapStyle, title, icon, onPress } = props;

  const buttonTitleStyle = useMemo(
    () =>
      themeType === 'dashBoard'
        ? commonButtonStyle.dashBoardTitleColorStyle
        : commonButtonStyle.innerPageTitleColorStyle,
    [themeType],
  );
  return (
    <View style={[commonButtonStyle.buttonWrap, wrapStyle]}>
      <Touchable style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter]} onPress={onPress}>
        <Svg icon={icon} size={pTd(46)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, commonButtonStyle.dashBoardTitleColorStyle, buttonTitleStyle]}>
        {title}
      </TextM>
    </View>
  );
};

export default memo(CommonToolButton);
