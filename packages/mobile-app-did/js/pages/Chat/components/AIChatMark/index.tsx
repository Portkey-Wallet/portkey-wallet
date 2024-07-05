import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { TextS } from 'components/CommonText';
import React, { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
export default memo(function AIChatMark(props: { containerStyle?: StyleProp<ViewStyle> }) {
  const { containerStyle } = props;
  return (
    <View
      style={[
        BGStyles.brandNormal,
        GStyles.paddingArg(pTd(2), pTd(6)),
        GStyles.radiusArg(pTd(4)),
        GStyles.marginLeft(pTd(4)),
        GStyles.marginRight(pTd(4)),
        containerStyle,
      ]}>
      <TextS numberOfLines={1} style={[fonts.regularFont, FontStyles.neutralDefaultBG]}>
        AI Chat
      </TextS>
    </View>
  );
});
