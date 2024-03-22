import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextM } from '../CommonText';
import { pTd } from '../../utils/unit';
import { TextStyleType, ViewStyleType } from '../../theme/type';
import { useTheme } from '../../theme';
import { defaultCss } from '../../theme/default';

export interface DividerProps {
  style?: ViewStyleType;
  lineStyle?: ViewStyleType;
  width?: number;
  insetType?: 'middle' | 'left' | 'right';
  inset?: boolean;
  title?: string;
  color?: string;
  titleStyle?: TextStyleType;
}

const Divider: React.FC<DividerProps> = ({
  style,
  width = StyleSheet.hairlineWidth,
  insetType = 'middle',
  title,
  color = defaultCss.border6,
  titleStyle,
  inset,
  lineStyle,
}) => {
  const theme = useTheme();
  const linStyle = [{ height: width, backgroundColor: color }, lineStyle];
  const textStyle = [{ color: theme.font7 }, styles[`${insetType}Title`], titleStyle];
  if (title && inset)
    return (
      <View style={[theme.flexRowWrap, theme.itemCenter, style]}>
        {insetType === 'left' && <TextM style={textStyle}>{title}</TextM>}
        <View style={[theme.flex1, linStyle]} />
        {insetType === 'middle' && <TextM style={textStyle}>{title}</TextM>}
        <View style={[theme.flex1, linStyle]} />
        {insetType === 'right' && <TextM style={textStyle}>{title}</TextM>}
      </View>
    );
  return <View style={[linStyle, style]} />;
};

export default Divider;

export const styles = StyleSheet.create({
  middleTitle: {
    marginHorizontal: pTd(16),
  },
  leftTitle: {
    marginRight: pTd(16),
  },
  rightTitle: {
    marginLeft: pTd(16),
  },
});
