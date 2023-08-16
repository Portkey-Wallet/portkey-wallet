import React, { memo } from 'react';
import { IMessage, MessageImageProps, Time } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import CacheImage from 'components/CacheImage';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import ChatOverlay from '../../ChatOverlay';

const MockImgSource = {
  uri: 'https://img0.baidu.com/it/u=3021883569,1259262591&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1692291600&t=d4573ac68a9f7486240eec1718ee9275',
};

function MessageImage(props: MessageImageProps<IMessage>) {
  const { currentMessage } = props;

  return (
    <Touchable
      onPress={event => {
        const { pageX, pageY } = event.nativeEvent;
        ChatOverlay.showPreviewImage({
          source: MockImgSource,
          thumb: MockImgSource,
          customBounds: { x: pageX, y: pageY, width: 0, height: 0 },
        });
      }}
      onLongPress={event => {
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
      }}>
      <CacheImage style={styles.image} resizeMode="contain" source={MockImgSource} />
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
    borderRadius: pTd(20),
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
