import GStyles from 'assets/theme/GStyles';
import { TextS } from 'components/CommonText';
import React from 'react';
import { View, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

interface ITagProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

const Tag: React.FC<ITagProps> = ({ style, textStyle, children }) => {
  return (
    <View style={[tagStyle.tag, style]}>
      <TextS style={[tagStyle.textStyle, textStyle]}>{children}</TextS>
    </View>
  );
};
const tagStyle = StyleSheet.create({
  tag: {
    ...GStyles.paddingArg(4, 6),
    borderRadius: pTd(4),
  },
  textStyle: {
    lineHeight: pTd(12),
  },
});
export default Tag;
