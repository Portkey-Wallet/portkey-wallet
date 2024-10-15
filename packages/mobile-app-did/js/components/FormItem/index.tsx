import { defaultColors, darkColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

export type FormItemType = {
  title: string;
  children: ReactNode;
  style?: any;
  titleStyle?: any;
};

export default function FormItem(props: FormItemType) {
  const { title, children, style = {}, titleStyle = {} } = props;

  return (
    <View style={style}>
      <TextM style={[styles.titleStyle, titleStyle]}>{title}</TextM>
      <View style={styles.childrenWrap}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    marginBottom: pTd(8),
    color: darkColors.textBase1,
  },
  childrenWrap: {
    width: '100%',
  },
});
