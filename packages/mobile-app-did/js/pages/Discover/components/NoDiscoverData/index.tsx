import { TextS } from 'components/CommonText';
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';

export interface INoDiscoverDataProps {
  type?: 'noBookmarks' | 'noRecords';
  size?: 'small' | 'large';
  location?: 'top' | 'center';
  backgroundColor?: string;
  style?: any;
  iconStyle?: any;
}

const NoDiscoverData = (props: INoDiscoverDataProps) => {
  const {
    type = 'noBookmarks',
    size = 'small',
    location = 'center',
    backgroundColor = defaultColors.bg1,
    style = {},
    iconStyle = {},
  } = props;
  const iconName = type === 'noBookmarks' ? 'no-bookmarks' : 'no-records';
  const noDataText = type === 'noBookmarks' ? 'No Bookmarks' : 'No Records';

  const wrapStyle: any = {
    backgroundColor,
  };

  return (
    <View
      style={[
        GStyles.flex1,
        GStyles.center,
        BGStyles.bg1,
        wrapStyle,
        location === 'top' && styles.topNoDataStyle,
        style,
      ]}>
      <Svg icon={iconName} size={pTd(size === 'large' ? 56 : 36)} iconStyle={[styles.icon, iconStyle]} />
      <TextS style={[FontStyles.font7, size === 'large' && styles.largeText]}>{noDataText}</TextS>
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
  },
  largeText: {
    fontSize: pTd(16),
  },
});
