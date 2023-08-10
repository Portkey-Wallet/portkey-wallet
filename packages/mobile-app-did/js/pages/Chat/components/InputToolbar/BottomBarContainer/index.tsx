import Svg from 'components/Svg';
import React, { ReactNode, memo, useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { Animated } from 'react-native';
import { TextInput } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import useEffectOnce from 'hooks/useEffectOnce';
import { useKeyboardAnim } from '../../hooks';
import { useBottomBarStatus, useChatText, useChatsDispatch } from '../../context/hooks';
import { ChatBottomBarStatus } from 'store/chat/slice';
import { setBottomBarStatus, setChatText } from '../../context/chatsContext';

export const ActionsIcon = memo(function ActionsIcon({ onPress }: { onPress?: () => void }) {
  return <Actions onPressActionButton={onPress} icon={() => <Svg icon="add1" />} optionTintColor="#222B45" />;
});

export const EmojiIcon = memo(function EmojiIcon({ onPress }: { onPress?: () => void }) {
  return <Actions onPressActionButton={onPress} icon={() => <Svg icon="add3" />} optionTintColor="#222B45" />;
});

export function AndroidInputContainer({
  children,
  textInputRef,
}: {
  children?: ReactNode;
  textInputRef: React.RefObject<TextInput>;
}) {
  const timer = useRef<NodeJS.Timeout>();

  const [hide, setHide] = useState<boolean>();
  const bottomBarStatus = useBottomBarStatus();

  const onPressIn = useCallback(() => {
    if (bottomBarStatus === undefined) {
      setHide(true);
      timer.current = setTimeout(() => {
        setHide(false);
      }, 300);
    }
    textInputRef.current?.focus();
  }, [bottomBarStatus, textInputRef]);
  useEffectOnce(() => {
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  });
  return (
    <Touchable
      activeOpacity={1}
      disabled={bottomBarStatus === ChatBottomBarStatus.input || hide}
      onPressIn={onPressIn}
      style={styles.inputContainerStyle}>
      <View style={hide ? styles.hideInput : GStyles.flex1} pointerEvents="box-only">
        {children}
      </View>
    </Touchable>
  );
}

export function BottomBarContainer({ children }: { children?: ReactNode; showKeyboard?: () => void }) {
  const bottomBarStatus = useBottomBarStatus();
  const dispatch = useChatsDispatch();
  const text = useChatText();
  const textInputRef = useRef<TextInput>(null);
  const keyboardAnim = useKeyboardAnim({ textInputRef });
  const timer = useRef<NodeJS.Timeout>();

  const inputFocus = useCallback(() => {
    textInputRef.current?.focus();
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      dispatch(setBottomBarStatus(ChatBottomBarStatus.input));
    }, 300);
  }, [dispatch]);

  const onPressActionButton = useCallback(
    (status: ChatBottomBarStatus) => {
      if (bottomBarStatus === status) {
        inputFocus();
      } else {
        dispatch(setBottomBarStatus(status));
        textInputRef.current?.blur();
      }
    },
    [bottomBarStatus, dispatch, inputFocus],
  );

  useEffectOnce(() => {
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  });
  return (
    <>
      <Touchable style={GStyles.flexRow}>
        <ActionsIcon onPress={() => onPressActionButton(ChatBottomBarStatus.tools)} />
        {isIOS ? (
          <TextInput
            onChangeText={v => dispatch(setChatText(v))}
            value={text}
            style={GStyles.flex1}
            ref={textInputRef as any}
          />
        ) : (
          <AndroidInputContainer textInputRef={textInputRef}>
            <TextInput
              value={text}
              onChangeText={v => dispatch(setChatText(v))}
              style={GStyles.flex1}
              ref={textInputRef as any}
            />
          </AndroidInputContainer>
        )}
        <EmojiIcon onPress={() => onPressActionButton(ChatBottomBarStatus.emoji)} />
      </Touchable>
      <Animated.View style={{ height: keyboardAnim }}>{children}</Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  toolsItem: {
    width: '25%',
    margin: pTd(2),
    backgroundColor: 'skyblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hideInput: {
    position: 'absolute',
    top: -1000,
    opacity: 0,
    ...GStyles.flex1,
  },
  inputContainerStyle: {
    height: 80,
    ...GStyles.flex1,
  },
  hide: {
    width: 0,
    height: 0,
  },
  absolute: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    zIndex: 999,
  },
});
