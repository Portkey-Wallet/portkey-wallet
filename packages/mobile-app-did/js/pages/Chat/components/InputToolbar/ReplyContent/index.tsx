import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { defaultColors } from 'assets/theme';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { useChatReplyMessageInfo, useChatsDispatch } from 'pages/Chat/context/hooks';
import { setReplyMessageInfo } from '../../../context/chatsContext';
import fonts from 'assets/theme/fonts';

function ReplyContent() {
  const replyMessageInfo = useChatReplyMessageInfo();
  const dispatch = useChatsDispatch();
  const { messageType, message } = replyMessageInfo || {};

  const closeReply = useCallback(() => {
    dispatch(setReplyMessageInfo(undefined));
  }, [dispatch]);

  if (!replyMessageInfo) return null;
  return (
    <View style={[GStyles.flexRow, GStyles.itemCenter, styles.wrap]}>
      <View style={styles.leftBlue} />
      {messageType === 'img' && (
        <Image style={styles.img} resizeMode="cover" source={{ uri: message?.imageInfo?.imgUri }} />
      )}
      <View style={[GStyles.flex1, GStyles.marginRight(8)]}>
        <TextM numberOfLines={1} style={[fonts.mediumFont, FontStyles.font5, GStyles.flex1]}>
          {`Reply to ${replyMessageInfo.message?.fromName}`}
        </TextM>
        <TextM numberOfLines={1} style={[FontStyles.font3, GStyles.flex1]}>
          {replyMessageInfo.messageType === 'img' ? 'Photo' : replyMessageInfo.message?.text}
        </TextM>
      </View>
      <Touchable onPress={closeReply}>
        <Svg icon="close" size={pTd(10)} />
      </Touchable>
    </View>
  );
}

export default memo(ReplyContent);

const styles = StyleSheet.create({
  wrap: {
    paddingLeft: pTd(12),
    paddingRight: pTd(16),
    paddingTop: pTd(8),
    backgroundColor: defaultColors.bg6,
  },
  leftBlue: {
    width: pTd(3),
    height: pTd(40),
    backgroundColor: defaultColors.primaryColor,
    marginRight: pTd(8),
  },
  img: {
    width: pTd(40),
    height: pTd(40),
    borderRadius: pTd(4),
    marginRight: pTd(8),
  },
});
