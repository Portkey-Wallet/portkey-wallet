import React, { memo } from 'react';
import { DimensionValue, View, ViewStyle } from 'react-native';
import { pTd } from '../../utils/unit';
import { TextL } from '../CommonText';
import Svg, { IconName } from '../Svg';
import { makeStyles } from '../../theme';

export type NoDataPropsType = {
  noPic?: boolean;
  icon?: IconName;
  message?: string;
  type?: 'center' | 'top';
  topDistance?: number | string;
  style?: ViewStyle;
};

const NoData: React.FC<NoDataPropsType> = props => {
  const {
    icon = 'noData',
    message = 'You have no transactions!',
    type = 'top',
    topDistance = pTd(89),
    noPic = false,
    style = {},
  } = props;

  let topStyle: ViewStyle = {};
  const styles = useStyles();
  if (type === 'top') {
    topStyle = {
      justifyContent: 'flex-start',
      paddingTop: topDistance as DimensionValue,
    };
  }

  return (
    <View style={[styles.wrap, topStyle, style]}>
      {!noPic && <Svg icon={icon} oblongSize={[pTd(160), pTd(140)]} iconStyle={styles.img} />}
      <TextL style={styles.message}>{message}</TextL>
    </View>
  );
};
export default memo(NoData);
const useStyles = makeStyles(theme => {
  return {
    wrap: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.bg1,
    },
    img: {
      marginBottom: pTd(8),
    },
    message: {
      color: theme.font7,
      lineHeight: pTd(22),
      textAlign: 'center',
    },
  };
});
