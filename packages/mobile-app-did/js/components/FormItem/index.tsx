import { defaultColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

export type FormItemType = {
  title: string;
  children: ReactNode;
};

export default function FormItem(props: FormItemType) {
  const { title, children } = props;

  return (
    <>
      <TextM style={styles.titleStyle}>{title}</TextM>
      <View style={styles.childrenWrap}>{children}</View>
    </>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    paddingLeft: pTd(8),
    marginBottom: pTd(8),
    color: defaultColors.font3,
  },
  childrenWrap: {
    width: '100%',
  },
});
