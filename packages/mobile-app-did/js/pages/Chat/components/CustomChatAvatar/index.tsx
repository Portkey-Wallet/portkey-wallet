import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AvatarProps, IMessage } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';
import CommonAvatar from 'components/CommonAvatar';

export default function CustomChatAvatar(props: AvatarProps<IMessage>) {
  console.log('CustomChatAvatar', props.currentMessage, props.previousMessage);
  const { currentMessage, previousMessage } = props;

  if (currentMessage?.user?._id === previousMessage?.user?._id) {
    return <View style={styles.blank} />;
  }

  return (
    <CommonAvatar
      hasBorder
      title={currentMessage?.user?.name || 'name'}
      avatarSize={pTd(40)}
      style={styles.avatarStyle}
    />
  );
}

const styles = StyleSheet.create({
  avatarStyle: {
    marginRight: pTd(4),
  },
  blank: {
    width: pTd(40),
    marginRight: pTd(4),
  },
});
