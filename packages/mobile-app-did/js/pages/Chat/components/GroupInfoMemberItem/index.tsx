import { TextL, TextS } from 'components/CommonText';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import CommonAvatar from 'components/CommonAvatar';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';

export type GroupInfoMemberItemType = {
  relationId: string;
  userId?: string;
  title: string;
  avatar?: string;
};

export type GroupInfoMemberItemPropsType = {
  item: GroupInfoMemberItemType;
  isOwner?: boolean;
  onPress?: (item: GroupInfoMemberItemType) => void;
  style?: ViewStyle;
};

export default function GroupInfoMemberItem(props: GroupInfoMemberItemPropsType) {
  const { item, isOwner, onPress, style } = props;

  return (
    <Touchable
      disabled={!onPress}
      style={[GStyles.flexRow, GStyles.itemCenter, styles.memberItem, style]}
      onPress={() => onPress?.(item)}>
      <CommonAvatar hasBorder resizeMode="cover" title={item.title} avatarSize={pTd(36)} imageUrl={item.avatar || ''} />
      <TextL numberOfLines={1} style={[FontStyles.font5, GStyles.flex1, styles.memberItemText]}>
        {item.title}
      </TextL>
      {isOwner && <TextS style={styles.ownerMark}>Owner</TextS>}
    </Touchable>
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
    backgroundColor: defaultColors.brandLight,
    color: defaultColors.bg5,
    textAlign: 'center',
    overflow: 'hidden',
  },
});
