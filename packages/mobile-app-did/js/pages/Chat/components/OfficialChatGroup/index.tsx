import React from 'react';
import { StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextL, TextM, TextS } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import GroupAvatarShow from '../GroupAvatarShow';
import fonts from 'assets/theme/fonts';

export default function OfficialChatGroup() {
  //TODO: change onPress
  return (
    <View style={styles.containerStyles}>
      <TextM style={[FontStyles.font3, styles.title]}>Official Group</TextM>
      <View style={styles.itemWrap}>
        <View style={styles.itemAvatar}>
          <GroupAvatarShow logoSize={pTd(14)} avatarSize={pTd(48)} svgName="officialGroup" />
        </View>
        <View style={styles.itemNameWrap}>
          <TextL numberOfLines={1} style={[fonts.mediumFont, FontStyles.font5]}>
            Portkey Official
          </TextL>
        </View>
        <Touchable style={styles.chatButton} onPress={() => console.log('hi')}>
          <TextS style={[FontStyles.font2, styles.chatText]}>Chat</TextS>
        </Touchable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg1,
  },
  title: {
    marginTop: pTd(32),
    marginLeft: pTd(20),
    marginBottom: pTd(8),
  },
  top: {
    ...GStyles.paddingArg(16, 20, 8),
  },
  itemWrap: {
    backgroundColor: defaultColors.bg1,
    height: pTd(72),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...GStyles.paddingArg(0, 20),
  },
  chatButton: {
    backgroundColor: defaultColors.bg5,
    color: defaultColors.font2,
    paddingHorizontal: pTd(12),
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
  itemAvatar: {
    marginRight: pTd(12),
  },
  itemNameWrap: {
    flex: 1,
  },
  chatText: {
    lineHeight: pTd(24),
  },
});
