// Svg.js
import React from 'react';
import { ViewStyle, StyleSheet, StyleProp } from 'react-native';
import SvgUri from './SvgUri.js';
import svgs from 'assets/image/svgs';

interface Svgs {
  [svgName: string]: any;
}
export type IconName = keyof typeof svgs;
export interface SvgProps {
  icon: IconName;
  id?: string;
  color?: string;
  size?: string | number;
  borderRadius?: string | number;
  iconStyle?: StyleProp<ViewStyle>;
  oblongSize?: [string | number, string | number];
}

const CommonSvg: React.FC<SvgProps> = (props: SvgProps) => {
  const { icon, color, size = 24, borderRadius = 0, iconStyle, oblongSize = [] } = props;
  const svgXmlData = (svgs as Svgs)[icon];

  if (!svgXmlData) {
    const err_msg = `There is no "${icon}" icon, please download the latest svg and run yarn generate-svg`;
    if (__DEV__) throw new Error(err_msg);
  }

  return (
    <SvgUri
      width={oblongSize[0] ?? size}
      height={oblongSize[1] ?? size}
      svgXmlData={svgXmlData}
      fill={color}
      style={[{ ...defaultStyle.svgWrap, borderRadius }, iconStyle]}
    />
  );
};

export default CommonSvg;

const defaultStyle = StyleSheet.create({
  svgWrap: {
    overflow: 'hidden',
  },
});
