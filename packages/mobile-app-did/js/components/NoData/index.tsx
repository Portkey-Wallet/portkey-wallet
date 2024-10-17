import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import { darkColors, defaultColors } from 'assets/theme';
import Svg, { IconName } from 'components/Svg';

export type NoDataPropsType = {
  noPic?: boolean;
  icon?: IconName;
  message?: string;
  type?: 'center' | 'top';
  topDistance?: number | string;
  style?: ViewStyle;
  oblongSize?: [string | number, string | number] | undefined;
};

const NoData: React.FC<NoDataPropsType> = props => {
  const {
    icon = 'no-data-detail',
    message = 'You have no transactions!',
    type = 'top',
    topDistance = pTd(89),
    noPic = false,
    style = {},
    oblongSize = [pTd(64), pTd(64)],
  } = props;

  let topStyle: ViewStyle = {};

  if (type === 'top') {
    topStyle = {
      justifyContent: 'flex-start',
      paddingTop: topDistance,
    };
  }

  return (
    <View style={[styles.wrap, topStyle, style]}>
      {!noPic && <Svg icon={icon} oblongSize={oblongSize} iconStyle={styles.img} />}
      <TextM style={styles.message}>{message}</TextM>
    </View>
  );
};
export default memo(NoData);
const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkColors.bgBase1,
  },
  img: {
    marginBottom: pTd(8),
  },
  message: {
    color: defaultColors.font7,
    lineHeight: pTd(22),
    textAlign: 'center',
  },
});
