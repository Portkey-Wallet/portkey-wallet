import { TextS } from 'components/CommonText';
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import Svg, { IconName } from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import { DarkFontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import { darkColors, defaultColors } from 'assets/theme';

export interface INoDiscoverDataProps {
  type?: 'noBookmarks' | 'noRecords';
  size?: 'small' | 'large';
  location?: 'top' | 'center';
  backgroundColor?: string;
  style?: any;
  iconStyle?: any;
  iconName?: IconName;
}

const NoDiscoverData = (props: INoDiscoverDataProps) => {
  const {
    type = 'noBookmarks',
    size = 'small',
    location = 'center',
    backgroundColor = defaultColors.bg1,
    style = {},
    iconStyle = {},
    iconName,
  } = props;
  const noDataText = type === 'noBookmarks' ? 'No bookmarks' : 'No history';

  const wrapStyle: any = {
    backgroundColor,
  };

  return (
    <View style={[GStyles.flex1, GStyles.center, wrapStyle, location === 'top' && styles.topNoDataStyle, style]}>
      {iconName && <Svg icon={iconName} size={pTd(size === 'large' ? 56 : 36)} iconStyle={[styles.icon, iconStyle]} />}
      <TextS style={[DarkFontStyles.textBase2, size === 'large' && styles.largeText]}>{noDataText}</TextS>
    </View>
  );
};

export default memo(NoDiscoverData);

const styles = StyleSheet.create({
  icon: {
    marginBottom: pTd(8),
  },
  topNoDataStyle: {
    justifyContent: 'flex-start',
    paddingTop: pTd(142),
    backgroundColor: darkColors.bgBase1,
  },
  largeText: {
    fontSize: pTd(16),
  },
});
