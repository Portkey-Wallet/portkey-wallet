import { TextM } from 'components/CommonText';
import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { ListItem } from '@rneui/themed';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';

type SearchPeopleItemProps<T> = {
  item?: any;
  onPress?: () => void;
};

export default memo(function SearchPeopleItem(props: SearchPeopleItemProps<any>) {
  const { item } = props;

  return (
    <ListItem.Content style={[GStyles.flexRow, GStyles.spaceBetween]}>
      <View style={GStyles.flexRow}>
        <Image
          source={{ uri: 'https://lmg.jj20.com/up/allimg/1111/05161Q64001/1P516164001-3-1200.jpg' }}
          style={{ width: 40, height: 40 }}
        />
        <View>
          <TextM>Potter</TextM>
          <TextM>hello Portkey</TextM>
        </View>
      </View>
      <View>
        <View style={GStyles.flexRow}>
          <Svg icon="desk-mac" />
          <TextM>16:00</TextM>
        </View>
        <TextM style={BGStyles.bg10}>99+</TextM>
      </View>
    </ListItem.Content>
  );
});

const styles = StyleSheet.create({
  itemWrap: {
    borderBottomColor: 'green',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  underlayLeftBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
    justifyContent: 'flex-end',
    backgroundColor: defaultColors.bg17,
    color: defaultColors.font1,
    textAlign: 'center',
  },
  itemRow: {
    padding: pTd(12),
    height: pTd(72),
  },
  deleteIconWrap: {
    marginRight: pTd(16),
  },
  websiteIconStyle: {
    marginRight: pTd(16),
  },
  infoWrap: {
    flex: 1,
  },
});
