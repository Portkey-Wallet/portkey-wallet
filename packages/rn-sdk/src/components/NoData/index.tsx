import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import { TextL } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import CommonSvg, { IconName } from 'components/Svg';

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

  if (type === 'top') {
    topStyle = {
      justifyContent: 'flex-start',
      paddingTop: topDistance as number,
    };
  }

  return (
    <View style={[styles.wrap, topStyle, style]}>
      {!noPic && <CommonSvg icon={icon} oblongSize={[pTd(160), pTd(140)]} iconStyle={styles.img} />}
      <TextL style={styles.message}>{message}</TextL>
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
    backgroundColor: defaultColors.bg1,
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
