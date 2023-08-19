import React, { memo, useCallback, useMemo } from 'react';
import { MessageImageProps, Time } from 'react-native-gifted-chat';
import { GestureResponderEvent, StyleSheet } from 'react-native';
import CacheImage from 'components/CacheImage';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import ChatOverlay from '../../ChatOverlay';
import { ChatMessage } from 'pages/Chat/types';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { formatImageSize } from '@portkey-wallet/utils/img';

const maxWidth = screenWidth * 0.6;
const maxHeight = screenWidth * 0.6;

function MessageImage(props: MessageImageProps<ChatMessage>) {
  const { currentMessage } = props;
  const { imageInfo } = currentMessage || {};
  const { imgUri, thumbUri, width, height } = imageInfo || {};
  const img = useMemo(() => {
    const imageSize = formatImageSize({ width, height, maxWidth, maxHeight });
    return (
      <CacheImage
        style={[styles.image, { width: imageSize.width, height: imageSize.height }]}
        resizeMode="cover"
        source={{ uri: decodeURIComponent(thumbUri || '') }}
      />
    );
  }, [height, thumbUri, width]);
  const onPreviewImage = useCallback(
    (event: GestureResponderEvent) => {
      const { pageX, pageY } = event.nativeEvent;
      ChatOverlay.showPreviewImage({
        source: { uri: decodeURIComponent(imgUri || '') },
        thumb: { uri: decodeURIComponent(thumbUri || '') },
        customBounds: { x: pageX, y: pageY, width: 0, height: 0 },
      });
    },
    [imgUri, thumbUri],
  );
  const onShowChatPopover = useCallback((event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    ChatOverlay.showChatPopover({
      list: [
        { title: 'Copy', iconName: 'copy' },
        { title: 'Delete', iconName: 'chat-delete' },
      ],
      px: pageX,
      py: pageY,
      formatType: 'dynamicWidth',
    });
  }, []);
  return (
    <Touchable onPress={onPreviewImage} onLongPress={onShowChatPopover}>
      {img}
      <Time
        timeFormat="HH:mm"
        timeTextStyle={timeTextStyle}
        containerStyle={timeContainerStyle}
        currentMessage={currentMessage}
      />
    </Touchable>
  );
}

export default memo(MessageImage);

const styles = StyleSheet.create({
  image: {
    borderTopRightRadius: 0,
    borderRadius: pTd(18),
    width: pTd(280),
    height: pTd(280),
  },
  textStyles: {
    fontSize: pTd(16),
    lineHeight: pTd(24),
    marginVertical: pTd(4),
    marginHorizontal: pTd(8),
  },
  linkStyle: {
    color: defaultColors.font4,
  },
  timeBoxStyle: {
    position: 'absolute',
    backgroundColor: defaultColors.bg20,
    paddingHorizontal: pTd(8),
    borderRadius: pTd(8),
    opacity: 0.8,
    bottom: 0,
    right: -pTd(4),
    height: pTd(16),
  },
  timeTextStyle: {
    color: defaultColors.font2,
    fontSize: pTd(10),
    lineHeight: pTd(16),
  },
});

const timeContainerStyle = {
  left: styles.timeBoxStyle,
  right: styles.timeBoxStyle,
};

const timeTextStyle = {
  left: styles.timeTextStyle,
  right: styles.timeTextStyle,
};
