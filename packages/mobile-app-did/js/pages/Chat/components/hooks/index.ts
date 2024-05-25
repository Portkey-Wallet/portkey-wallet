import { bottomBarHeight, isIOS, isXiaoMi } from '@portkey-wallet/utils/mobile/device';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import { useKeyboard } from 'hooks/useKeyboardHeight';
import usePrevious from 'hooks/usePrevious';
import { TextInput } from 'react-native';
import { useBottomBarStatus, useChatsDispatch, useCurrentChannelId } from '../../context/hooks';
import { ChatBottomBarStatus } from 'store/chat/slice';
import { setBottomBarStatus } from '../../context/chatsContext';
import { useChannelItemInfo, useHideChannel, useSendChannelMessage } from '@portkey-wallet/hooks/hooks-ca/im';
import { Message, MessageType } from '@portkey-wallet/im';
import { readFile } from 'utils/fs';
import { formatRNImage } from '@portkey-wallet/utils/s3';
import { bindUriToLocalImage } from 'utils/fs/img';
import s3Instance from '@portkey-wallet/utils/s3';
import { pTd } from 'utils/unit';

export const TopSpacing = isIOS ? bottomBarHeight : isXiaoMi ? Math.max(-bottomBarHeight, -10) : 0;

const ToolsHeight = pTd(196);

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
  const currentChannelInfo = useChannelItemInfo(currentChannelId || '');
  const { sendMessageToPeople, sendChannelMessage, sendChannelImageByS3Result } = useSendChannelMessage();

  return useMemo(
    () => ({
      sendMessageToPeople: ({ type, content }: { content: string; type?: MessageType }) =>
        sendMessageToPeople({
          toRelationId: currentChannelInfo?.toRelationId,
          channelId: currentChannelId || '',
          content,
          type,
        }),
      sendChannelMessage: ({
        content,
        type,
        quoteMessage,
      }: {
        content: string;
        type?: MessageType;
        quoteMessage?: Message;
      }) =>
        sendChannelMessage({
          channelId: currentChannelId || '',
          content,
          type,
          quoteMessage,
        }),
      sendChannelImage: async (file: { uri: string; width: number; height: number }) => {
        const fileBase64 = await readFile(file.uri, { encoding: 'base64' });
        const data = formatRNImage(file, fileBase64);
        const s3Result = await s3Instance.uploadFile({
          body: data.body,
          suffix: data.suffix,
        });
        await bindUriToLocalImage(file.uri, s3Result.url);

        return sendChannelImageByS3Result({
          toRelationId: currentChannelInfo?.toRelationId,
          channelId: currentChannelId || '',
          s3Result: { ...s3Result, ...data },
        });
      },
    }),
    [
      currentChannelId,
      currentChannelInfo?.toRelationId,
      sendChannelImageByS3Result,
      sendChannelMessage,
      sendMessageToPeople,
    ],
  );
}

export function useHideCurrentChannel() {
  const currentChannelId = useCurrentChannelId();
  const hideChannel = useHideChannel();
  return useCallback(() => hideChannel(currentChannelId || '', true), [currentChannelId, hideChannel]);
}
