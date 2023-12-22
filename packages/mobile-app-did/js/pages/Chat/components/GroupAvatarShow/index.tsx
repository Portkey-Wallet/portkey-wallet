import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import CommonAvatar, { CommonAvatarProps } from 'components/CommonAvatar';
import { pTd } from 'utils/unit';

type GroupAvatarShowType = CommonAvatarProps & {
  wrapStyle?: StyleProp<ViewStyle> | undefined;
  logoSize?: number;
};

const GroupAvatarShow = (props: GroupAvatarShowType) => {
  const { logoSize = pTd(20), wrapStyle = {} } = props;

  return (
    <View style={[styles.groupAvatarWrap, wrapStyle]}>
      <CommonAvatar {...props} resizeMode="cover" />
      <CommonAvatar style={styles.smallLogo} avatarSize={logoSize} svgName="chat-group-avatar-small-logo" />
    </View>
  );
};

export default GroupAvatarShow;

const styles = StyleSheet.create({
  groupAvatarWrap: {
    position: 'relative',
  },
  smallLogo: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
