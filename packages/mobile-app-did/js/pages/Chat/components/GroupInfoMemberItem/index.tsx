import { TextL, TextM } from 'components/CommonText';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import CommonAvatar from 'components/CommonAvatar';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';

export type GroupInfoMemberItemPropsType = {
  item: {
    id: string;
    title: string;
  };
  isOwner?: boolean;
  style?: ViewStyle;
};

export default function GroupInfoMemberItem(props: GroupInfoMemberItemPropsType) {
  const { item, isOwner, style } = props;

  return (
    <View style={[GStyles.flexRow, GStyles.itemCenter, styles.memberItem, style]}>
      <CommonAvatar hasBorder title={item.title} avatarSize={pTd(36)} />
      <TextL numberOfLines={1} style={[FontStyles.font5, GStyles.flex1, styles.memberItemText]}>
        {'AAAAAA'}
      </TextL>
      {isOwner && <TextM style={styles.ownerMark}>Owner</TextM>}
    </View>
  );
}

const styles = StyleSheet.create({
  memberItem: {
    height: pTd(72),
    borderBottomColor: defaultColors.border1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: StyleSheet.hairlineWidth,
  },
  memberItemText: {
    marginLeft: pTd(8),
  },
  ownerMark: {
    height: pTd(20),
    lineHeight: pTd(20),
    borderRadius: pTd(4),
    paddingHorizontal: pTd(8),
    backgroundColor: defaultColors.bg9,
    color: defaultColors.bg5,
    textAlign: 'center',
    overflow: 'hidden',
  },
});
