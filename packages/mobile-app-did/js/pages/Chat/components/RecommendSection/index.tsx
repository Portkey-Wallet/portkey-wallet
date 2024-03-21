import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View, Image } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { TextL, TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import chatRobot from 'assets/image/pngs/chat-robot.png';

export default function RecommendSection() {
  const renderItem = useCallback(() => {
    return (
      <View style={[GStyles.flexRow, styles.itemWrap]}>
        <Image source={chatRobot} style={styles.avatarStyle} />
        <View style={[GStyles.flexRow, GStyles.spaceBetween, GStyles.itemCenter, GStyles.flex1, styles.rightSection]}>
          <TextL>Robot</TextL>
          <Touchable>
            <TextS style={styles.chatButton}>Chat</TextS>
          </Touchable>
        </View>
      </View>
    );
  }, []);

  return (
    <View style={styles.containerStyles}>
      <View style={[GStyles.flexRow, GStyles.spaceBetween, styles.top]}>
        <TextM style={FontStyles.font3}>Recommend</TextM>
        <Touchable>
          <TextS style={FontStyles.font7}>Skip</TextS>
        </Touchable>
      </View>
      <FlatList style={BGStyles.bg1} keyExtractor={item => item} data={new Array(2)} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
  },
  top: {
    ...GStyles.paddingArg(16, 20, 8),
  },
  svgWrap: {
    padding: pTd(16),
  },
  itemWrap: {
    width: screenWidth,
    height: pTd(72),
  },
  avatarStyle: {
    width: pTd(48),
    height: pTd(48),
    marginHorizontal: pTd(20),
    marginVertical: pTd(12),
  },
  rightSection: {
    borderBottomColor: defaultColors.border1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: pTd(20),
  },
  chatButton: {
    backgroundColor: defaultColors.bg5,
    color: defaultColors.font2,
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(4),
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
});
