import { bottomBarHeight, isIOS } from '@portkey-wallet/utils/mobile/device';
import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import { useKeyboard } from 'hooks/useKeyboardHeight';
import usePrevious from 'hooks/usePrevious';
import { TextInput } from 'react-native';
import { useBottomBarStatus, useChatsDispatch, useCurrentChannelId } from '../../context/hooks';
import { ChatBottomBarStatus } from 'store/chat/slice';
import { setBottomBarStatus } from '../../context/chatsContext';
import { useSendChannelMessage } from '@portkey-wallet/hooks/hooks-ca/im';
import { MessageType } from '@portkey-wallet/im';
import { readFile } from 'utils/fs';
import { formatRNImage } from '@portkey-wallet/utils/s3';
import { bindUriToLocalImage } from 'utils/fs/img';
import s3Instance from '@portkey-wallet/utils/s3';

let TopSpacing = isIOS ? bottomBarHeight : -(bottomBarHeight * 2);
if (!isIOS) {
  TopSpacing = TopSpacing > -30 ? -30 : TopSpacing;
}

const ToolsHeight = 100;

export function useKeyboardAnim({ textInputRef }: { textInputRef: React.RefObject<TextInput> }) {
  const keyboardAnim = useRef(new Animated.Value(0)).current;
  const bottomBarStatus = useBottomBarStatus();
  const animatedRef = useRef<{ [key: number]: Animated.CompositeAnimation }>();
  const dispatch = useChatsDispatch();
  const showTools = useMemo(
    () => bottomBarStatus === ChatBottomBarStatus.tools || bottomBarStatus === ChatBottomBarStatus.emoji,
    [bottomBarStatus],
  );
  const { keyboardHeight, isKeyboardOpened } = useKeyboard(TopSpacing);

  const toValue = useMemo(() => {
    if (bottomBarStatus === ChatBottomBarStatus.tools) return ToolsHeight;
    return showTools || isKeyboardOpened ? keyboardHeight : 0;
  }, [bottomBarStatus, isKeyboardOpened, keyboardHeight, showTools]);
  // const toValue = useMemo(
  //   () => (showTools || isKeyboardOpened ? keyboardHeight : 0),
  //   [isKeyboardOpened, keyboardHeight, showTools],
  // );
  const preToValue = usePrevious(toValue);
  useEffect(() => {
    // no change
    if (preToValue === toValue) return;

    if (!animatedRef.current?.[toValue]) {
      animatedRef.current = {
        ...animatedRef.current,
        [toValue]: Animated.timing(keyboardAnim, {
          toValue,
          duration: toValue > 0 ? 150 : 100,
          useNativeDriver: false,
        }),
      };
    }
    animatedRef.current[toValue].start();
  }, [keyboardAnim, preToValue, toValue]);

  useEffect(() => {
    if (isKeyboardOpened) dispatch(setBottomBarStatus(ChatBottomBarStatus.input));
    else textInputRef.current?.blur();
  }, [dispatch, isKeyboardOpened, textInputRef]);

  return keyboardAnim;
}

export function useSendCurrentChannelMessage() {
  const currentChannelId = useCurrentChannelId();
  const { sendChannelMessage, sendChannelImageByS3Result } = useSendChannelMessage();
  return useMemo(
    () => ({
      sendChannelMessage: (content: string, type?: MessageType) =>
        sendChannelMessage(currentChannelId || '', content, type),
      sendChannelImage: async (file: { uri: string; width: number; height: number }) => {
        const fileBase64 = await readFile(file.uri, { encoding: 'base64' });
        const data = formatRNImage(file, fileBase64);
        const s3Result = await s3Instance.uploadFile({
          body: data.body,
          suffix: data.suffix,
        });
        await bindUriToLocalImage(file.uri, s3Result.url);

        return sendChannelImageByS3Result(currentChannelId || '', { ...s3Result, ...data });
      },
    }),
    [currentChannelId, sendChannelImageByS3Result, sendChannelMessage],
  );
}
