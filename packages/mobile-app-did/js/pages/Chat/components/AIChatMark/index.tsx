import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { TextS } from 'components/CommonText';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { StyleProp, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
export default memo(function AIChatMark(props: { containerStyle?: StyleProp<ViewStyle> }) {
  const { containerStyle } = props;
  return (
    <View
      style={[
        BGStyles.brandNormal,
        GStyles.paddingArg(pTd(0), pTd(6)),
        GStyles.radiusArg(pTd(4)),
        GStyles.marginLeft(pTd(4)),
        GStyles.marginRight(pTd(4)),
        GStyles.center,
        containerStyle,
        styles.container,
      ]}>
      <TextS numberOfLines={1} style={[fonts.mediumFont, FontStyles.neutralDefaultBG, styles.mark]}>
        AI Chat
      </TextS>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    height: pTd(16),
  },
  mark: {
    lineHeight: pTd(12),
  },
});
