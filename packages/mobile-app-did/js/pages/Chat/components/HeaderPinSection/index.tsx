import React from 'react';
import navigationService from 'utils/navigationService';
import { TextL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import { defaultColors } from 'assets/theme';
import { Image, StyleSheet, View } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';

export default function HeaderPinSection() {
  return (
    <View style={[GStyles.flexRow, GStyles.itemCenter, styles.wrap]}>
      <Image style={styles.img} resizeMode="cover" source={{ uri: '' }} />
      <TextL numberOfLines={1} style={[FontStyles.font4, GStyles.marginLeft(pTd(16))]}>
        Pin Message
      </TextL>
      <TextL numberOfLines={1}>count:3</TextL>
      <Touchable onPress={() => navigationService.navigate('PinnedListPage')}>
        <Svg icon="add-contact" />
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(8),
    // backgroundColor: defaultColors.bg1,
    backgroundColor: 'red',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  img: {
    width: pTd(40),
    height: pTd(40),
    borderRadius: pTd(4),
  },
});
