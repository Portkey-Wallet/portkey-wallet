import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { useBottomBarStatus, useChatText, useChatsDispatch } from '../../../context/hooks';
import GStyles from 'assets/theme/GStyles';
import { setChatText } from '../../../context/chatsContext';
import Svg from 'components/Svg';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { ChatBottomBarStatus } from 'store/chat/slice';
import Touchable from 'components/Touchable';
import { chatInputRecorder } from 'pages/Chat/utils';
import useEffectOnce from 'hooks/useEffectOnce';
import { defaultColors } from 'assets/theme';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { MAX_INPUT_LENGTH } from '@portkey-wallet/constants/constants-ca/im';
import { FontStyles } from 'assets/theme/styles';
import { ViewStyleType } from 'types/styles';
export interface ChatInput extends TextInput {
  focus: (autoHide?: boolean) => void;
}

export const EmojiIcon = memo(function EmojiIcon({ onPress, style }: { onPress?: () => void; style?: ViewStyleType }) {
  const bottomBarStatus = useBottomBarStatus();
  return (
    <Touchable onPressWithSecond={500} style={[styles.emojiSvg, style]} onPress={onPress}>
      <Svg
        color={FontStyles.font3.color}
        size={pTd(24)}
        icon={bottomBarStatus !== ChatBottomBarStatus.emoji ? 'chat-emoji' : 'chat-keyboard'}
      />
    </Touchable>
  );
});

const ChatInput = forwardRef(function Input(props: TextInputProps, _ref) {
  const bottomBarStatus = useBottomBarStatus();
  const dispatch = useChatsDispatch();
  const text = useChatText();

  const onSelectionChange = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      if (bottomBarStatus === ChatBottomBarStatus.emoji) return;
      chatInputRecorder?.setSelection(nativeEvent.selection);
    },
    [bottomBarStatus],
  );

  const onChangeText = useCallback(
    (v: string) => {
      dispatch(setChatText(v));
      chatInputRecorder?.setText(v);
    },
    [dispatch],
  );
  return (
    <TextInput
      multiline
      value={text}
      ref={_ref as any}
      maxLength={MAX_INPUT_LENGTH}
      onChangeText={onChangeText}
      onSelectionChange={onSelectionChange}
      {...props}
      style={[styles.input, props.style]}
    />
  );
});

export const AndroidChatInputBar = forwardRef(function InputBar(
  {
    onPressActionButton,
  }: {
    onPressActionButton: (status: ChatBottomBarStatus) => void;
  },
  _ref,
) {
  const timer = useRef<NodeJS.Timeout>();
  const textInputRef = useRef<TextInput>();
  const [hide, setHide] = useState<boolean>();
  const bottomBarStatus = useBottomBarStatus();
  const [inputBlur, setInputBlur] = useState(true);
  const dimensionsRef = useRef<{ width: number; height: number }>();

  const onFocus = useCallback((autoHide?: boolean) => {
    if (autoHide) {
      setHide(true);
      timer.current = setTimeout(() => {
        setHide(false);
      }, 400);
    }
    textInputRef.current?.focus();
  }, []);

  useImperativeHandle(_ref, () => ({
    focus: (autoHide?: boolean) => onFocus(autoHide),
    blur: () => textInputRef.current?.blur(),
    setNativeProps: (nativeProps: object) => textInputRef.current?.setNativeProps(nativeProps),
  }));

  const onPressIn = useCallback(() => {
    if (!bottomBarStatus || bottomBarStatus !== ChatBottomBarStatus.emoji) {
      onFocus(true);
    } else {
      textInputRef.current?.focus();
    }
  }, [bottomBarStatus, onFocus]);

  useEffectOnce(() => {
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  });

  const determineInputSizeChange = useCallback((dimensions: { width: number; height: number }) => {
    // Support earlier versions of React Native on Android.
    if (!dimensions) return;
    if (
      !dimensionsRef ||
      !dimensionsRef.current ||
      (dimensionsRef.current &&
        (dimensionsRef.current.width !== dimensions.width || dimensionsRef.current.height !== dimensions.height))
    ) {
      dimensionsRef.current = dimensions;
    }
  }, []);

  const handleContentSizeChange = useCallback(
    ({ nativeEvent: { contentSize } }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) =>
      determineInputSizeChange(contentSize),
    [determineInputSizeChange],
  );
  const inputDisabled = useMemo(() => !inputBlur || hide, [hide, inputBlur]);
  return (
    <View style={styles.inputWrapStyle}>
      <Touchable
        activeOpacity={1}
        disabled={inputDisabled}
        onPressIn={onPressIn}
        style={[styles.androidInputWrapStyle, hide ? { height: dimensionsRef.current?.height } : undefined]}>
        <View style={hide ? styles.hideInput : GStyles.flex1} pointerEvents={!inputDisabled ? 'box-only' : 'auto'}>
          <ChatInput
            ref={textInputRef}
            style={styles.inputStyle}
            onBlur={() => setInputBlur(true)}
            onFocus={() => setInputBlur(false)}
            onContentSizeChange={handleContentSizeChange}
          />
        </View>
      </Touchable>
      <EmojiIcon style={styles.emojiStyle} onPress={() => onPressActionButton(ChatBottomBarStatus.emoji)} />
    </View>
  );
});

export const IOSChatInputBar = forwardRef(function InputBar(
  {
    onPressActionButton,
  }: {
    onPressActionButton: (status: ChatBottomBarStatus) => void;
  },
  _ref,
) {
  return (
    <View style={styles.inputWrapStyle}>
      <ChatInput style={styles.inputStyle} ref={_ref} />
      <EmojiIcon style={styles.emojiStyle} onPress={() => onPressActionButton(ChatBottomBarStatus.emoji)} />
    </View>
  );
});
// Android interacts diffe than iOS
export const ChatInputBar = isIOS ? IOSChatInputBar : AndroidChatInputBar;

const styles = StyleSheet.create({
  inputStyle: {
    paddingRight: pTd(40),
    fontSize: pTd(16),
    lineHeight: pTd(20),
  },
  emojiStyle: { position: 'absolute', bottom: pTd(8) },
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
    paddingRight: 0,
    paddingVertical: pTd(6),
    minHeight: pTd(40),
    maxHeight: pTd(200),
    ...GStyles.flex1,
  },
  androidInputWrapStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: pTd(28),
    maxHeight: pTd(188),
    ...GStyles.flex1,
  },
  input: {
    width: '100%',
    padding: 0,
    paddingLeft: pTd(16),
  },
  hideInput: {
    position: 'absolute',
    top: -1000,
    opacity: 0,
    ...GStyles.flex1,
  },
});
