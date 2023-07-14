import { TextS } from 'components/CommonText';
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';

export interface INoDiscoverDataProps {
  type?: 'noBookmarks' | 'noRecords';
}

const NoDiscoverData = (props: INoDiscoverDataProps) => {
  const { type = 'noBookmarks' } = props;
  const iconName = type === 'noBookmarks' ? 'no-bookmarks' : 'no-records';
  const noDataText = type === 'noBookmarks' ? 'No Bookmarks' : 'No Records';

  return (
    <View style={[GStyles.flex1, GStyles.center, BGStyles.bg1]}>
      <Svg icon={iconName} size={pTd(36)} iconStyle={styles.icon} />
      <TextS style={FontStyles.font7}>{noDataText}</TextS>
    </View>
  );
};

export default memo(NoDiscoverData);

const styles = StyleSheet.create({
  icon: {
    marginBottom: pTd(8),
  },
});
