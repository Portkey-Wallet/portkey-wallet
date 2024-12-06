import React from 'react';
import { makeStyles } from '@rneui/themed';
import { TextM } from 'components/CommonText';

const GeneralTips = (props: { content: string }) => {
  const { content } = props;
  const styles = getStyles();
  return <TextM style={styles.textStyle}>{content}</TextM>;
};

export default GeneralTips;

const getStyles = makeStyles(theme => ({
  textStyle: {
    color: theme.colors.textBase2,
  },
}));
