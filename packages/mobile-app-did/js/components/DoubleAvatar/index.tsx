import React from 'react';
import { pTd } from 'utils/unit';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import CommonAvatar, { CommonAvatarProps } from 'components/CommonAvatar';

export type TDoubleAvatarProps = {
  firstAvatar: CommonAvatarProps;
  secondAvatar: CommonAvatarProps;
};

export default function DoubleAvatar({ firstAvatar, secondAvatar }: TDoubleAvatarProps) {
  return (
    <View style={styles.wrap}>
      <CommonAvatar {...firstAvatar} avatarSize={pTd(24)} style={styles.avatar1} />
      <CommonAvatar {...secondAvatar} avatarSize={pTd(24)} style={styles.avatar2} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: {
    width: pTd(32),
    height: pTd(32),
    position: 'relative',
    marginRight: pTd(8),
  },
  avatar1: {
    position: 'absolute',
    zIndex: 100,
    left: 0,
    top: 0,
  },
  avatar2: {
    position: 'absolute',
    zIndex: 101,
    right: 0,
    bottom: 0,
  },
});
