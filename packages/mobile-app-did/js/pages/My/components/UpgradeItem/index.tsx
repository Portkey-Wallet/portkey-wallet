import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { ImageBackground, StyleSheet, View, Image } from 'react-native';
import upGradeBackground from 'assets/image/pngs/upGradeBackground.png';
import upGrade from 'assets/image/pngs/upGrade.png';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import { showUpgradeOverlay } from 'components/UpgradeOverlay';

const UpgradeItem: React.FC = () => {
  return (
    <ImageBackground
      source={upGradeBackground}
      resizeMode="stretch"
      style={[GStyles.flexRow, GStyles.center, styles.itemWrap]}>
      <Image source={upGrade} style={styles.img} />
      <View style={GStyles.flex1}>
        <TextM style={FontStyles.font5}>Portkey Upgraded</TextM>
        <TextM style={styles.blank} />
        <TextS style={FontStyles.font3}>With enhanced user experience!</TextS>
      </View>
      <Touchable
        onPress={() => showUpgradeOverlay({ type: 'my' })}
        style={[GStyles.flexCenter, GStyles.itemCenter, styles.btn]}>
        <TextS style={FontStyles.font11}>Upgrade</TextS>
      </Touchable>
    </ImageBackground>
  );
};

export default memo(UpgradeItem);

const styles = StyleSheet.create({
  itemWrap: {
    marginHorizontal: pTd(20),
    marginBottom: pTd(8),
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(10),
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
  img: {
    width: pTd(52),
    height: pTd(52),
    marginRight: pTd(8.5),
    marginLeft: 0,
  },
  blank: {
    height: pTd(4),
  },
  btn: {
    width: pTd(70),
    height: pTd(24),
    backgroundColor: defaultColors.bg5,
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
});
