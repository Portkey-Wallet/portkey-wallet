import React, { useCallback } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { TextM, TextL } from 'components/CommonText';

import Chats from '../components/Chats';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import ChatOverlay from '../components/ChatOverlay';
import navigationService from 'utils/navigationService';
import { ChatOperationsEnum } from '@portkey-wallet/constants/constants-ca/chat';
import CommonAvatar from 'components/CommonAvatar';
import { FontStyles } from 'assets/theme/styles';

const ChatDetails = () => {
  const onPressMore = useCallback((event: { nativeEvent: { pageX: any; pageY: any } }) => {
    const { pageX, pageY } = event.nativeEvent;
    ChatOverlay.showChatPopover({
      list: [
        {
          title: ChatOperationsEnum.PROFILE,
          iconName: 'chat-profile',
          onPress: () => navigationService.navigate('Profile'),
        },
        { title: ChatOperationsEnum.PIN, iconName: 'chat-unpin' },
        { title: ChatOperationsEnum.MUTE, iconName: 'chat-unmute' },
        { title: ChatOperationsEnum.DELETE_CHAT, iconName: 'chat-delete' },
      ],
      px: pageX,
      py: pageY,
      position: 'left',
    });
  }, []);

  return (
    <PageContainer
      noCenterDom
      hideTouchable
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}
      leftDom={
        <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.paddingLeft(pTd(16))]}>
          <Touchable style={GStyles.marginRight(pTd(20))} onPress={navigationService.goBack}>
            <Svg size={pTd(20)} icon="left-arrow" color={defaultColors.bg1} />
          </Touchable>
          <CommonAvatar title="N" avatarSize={pTd(32)} style={styles.headerAvatar} />
          <TextL style={[FontStyles.font2, GStyles.marginLeft(pTd(8))]}>Name</TextL>
        </View>
      }
      rightDom={
        <Touchable style={GStyles.marginRight(pTd(16))} onPress={onPressMore}>
          <Svg size={pTd(20)} icon="more" color={defaultColors.bg1} />
        </Touchable>
      }>
      <Chats />
    </PageContainer>
  );
};

export default ChatDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  headerAvatar: {
    fontSize: pTd(14),
  },
});
