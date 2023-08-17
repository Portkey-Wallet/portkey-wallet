import React, { forwardRef, memo, useCallback } from 'react';
import { NativeSyntheticEvent, TextInput, TextInputSelectionChangeEventData, View } from 'react-native';
import { useChatText, useChatsDispatch, useIsShowEmoji } from '../../context/hooks';
import GStyles from 'assets/theme/GStyles';
import { setChatText } from '../../context/chatsContext';
import Svg from 'components/Svg';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { ChatBottomBarStatus } from 'store/chat/slice';
import Touchable from 'components/Touchable';
import { chatInputRecorder } from 'pages/Chat/utils';

export const EmojiIcon = memo(function EmojiIcon({ onPress }: { onPress?: () => void }) {
  return (
    <Touchable onPressWithSecond={500} style={styles.emojiSvg} onPress={onPress}>
      <Svg color="#222B45" size={pTd(24)} icon="chat-emoji" />
    </Touchable>
  );
});
export const ChatInput = forwardRef(function InputBar(
  {
    onPressActionButton,
  }: {
    onPressActionButton: (status: ChatBottomBarStatus) => void;
  },
  _ref,
) {
  const dispatch = useChatsDispatch();
  const text = useChatText();
  const isShowEmoji = useIsShowEmoji();
  const onChangeText = useCallback(
    (v: string) => {
      dispatch(setChatText(v));
      chatInputRecorder?.setText(v);
    },
    [dispatch],
  );
  const onSelectionChange = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      if (isShowEmoji) return;
      chatInputRecorder?.setSelection(nativeEvent.selection);
    },
    [isShowEmoji],
  );
  return (
    <View style={[GStyles.flex1, styles.inputWrapStyle]}>
      <TextInput
        multiline
        value={text}
        ref={_ref as any}
        style={styles.input}
        onChangeText={onChangeText}
        onSelectionChange={onSelectionChange}
      />
      <EmojiIcon onPress={() => onPressActionButton(ChatBottomBarStatus.emoji)} />
    </View>
  );
});

const styles = StyleSheet.create({
  emojiSvg: {
    marginLeft: 0,
    marginBottom: 0,
    position: 'absolute',
    right: pTd(8),
    bottom: pTd(8),
  },
  inputWrapStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(20),
    paddingRight: pTd(40),
    paddingVertical: pTd(6),
    minHeight: pTd(40),
    maxHeight: pTd(200),
  },
  input: {
    width: '100%',
    paddingLeft: pTd(16),
  },
  hide: {
    width: 0,
    height: 0,
  },
});
