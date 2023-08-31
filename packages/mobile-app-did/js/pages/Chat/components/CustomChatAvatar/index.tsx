import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AvatarProps } from 'react-native-gifted-chat';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { ChatMessage } from 'pages/Chat/types';
import { TextM } from 'components/CommonText';

export default function CustomChatAvatar(props: AvatarProps<ChatMessage>) {
  console.log('CustomChatAvatar', props);

  return (
    <View>
      <TextM>头像</TextM>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperStyle: {
    borderRadius: pTd(20),
    color: defaultColors.font5,
  },
  wrapLeft: {
    backgroundColor: defaultColors.bg18,
    borderTopLeftRadius: pTd(2),
    marginLeft: -pTd(8),
  },
});
