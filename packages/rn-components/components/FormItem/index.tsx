import { TextM } from '../CommonText';
import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { pTd } from '../../utils/unit';
import { Theme } from '../../theme/type';
import { makeStyles } from '../../theme';

export type FormItemType = {
  title: string;
  children: ReactNode;
  style?: any;
};

export default function FormItem(props: FormItemType) {
  const { title, children, style = {} } = props;
  const styles = useStyles();
  return (
    <View style={style}>
      <TextM style={styles.titleStyle}>{title}</TextM>
      <View style={styles.childrenWrap}>{children}</View>
    </View>
  );
}

const useStyles = makeStyles((theme: Theme) => {
  return {
    titleStyle: {
      paddingLeft: pTd(8),
      marginBottom: pTd(8),
      color: theme.font3,
    },
    childrenWrap: {
      width: '100%',
    },
  };
});
