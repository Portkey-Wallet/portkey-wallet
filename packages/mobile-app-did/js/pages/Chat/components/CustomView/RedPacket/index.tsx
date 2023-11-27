import React, { memo, useCallback } from 'react';
import { MessageProps } from 'react-native-gifted-chat';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { ChatMessage } from 'pages/Chat/types';
import isEqual from 'lodash/isEqual';
import { TextXL, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import Loading from 'components/Loading';
import ViewPacketOverlay from '../../ViewPacketOverlay';

function RedPacket(props: MessageProps<ChatMessage>) {
  const { currentMessage } = props;

  const isOpened = false;
  const isExpired = false;
  const isOpacity = !isOpened && !isExpired;

  console.log('currentMessage', currentMessage);

  const onPress = useCallback(() => {
    Loading.show();
    //TODO: get red packet states
    //  if(open){
    ViewPacketOverlay.showViewPacketOverlay();
    //  }else{
    //   navigationService.navigate("redpacket detail")
    //  }
    // ViewPacketOverlay.showViewPacketOverlay();

    Loading.hide();
  }, []);

  return (
    <Touchable
      highlight={!isOpacity}
      underlayColor={isOpacity ? undefined : defaultColors.bg24}
      style={[styles.wrap, isOpacity && styles.opacityWrap]}
      onPress={onPress}>
      <View style={[GStyles.flexRow, GStyles.itemCenter]}>
        <Svg icon={isOpened ? 'red-packet-opened' : 'red-packet'} size={pTd(40)} />
        <View style={styles.rightSection}>
          <TextXL numberOfLines={1} style={styles.memo}>
            Best Wishes! Best Wishes! Best Wishes! Best Wishes! Best Wishes!
          </TextXL>
          <View style={styles.blank} />
          <TextS style={styles.state}>Expired</TextS>
        </View>
      </View>
    </Touchable>
  );
}

export default memo(RedPacket, (prevProps, nextProps) => {
  return isEqual(prevProps.currentMessage, nextProps.currentMessage);
});

const styles = StyleSheet.create({
  wrap: {
    width: pTd(260),
    height: pTd(72),
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(16),
    backgroundColor: defaultColors.bg22,
    borderRadius: pTd(12),
    overflow: 'hidden',
  },
  opacityWrap: {
    backgroundColor: defaultColors.bg23,
  },
  rightSection: {
    marginLeft: pTd(12),
    width: pTd(180),
  },
  blank: {
    height: pTd(2),
  },
  memo: {
    color: defaultColors.font2,
  },
  state: {
    color: defaultColors.font2,
  },
});
