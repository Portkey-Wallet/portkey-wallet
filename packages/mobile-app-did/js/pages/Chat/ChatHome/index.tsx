import React, { useMemo } from 'react';
import { View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';

import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import CustomHeader from 'components/CustomHeader';
import ChatOverlay from '../components/ChatOverlay';
import Touchable from 'components/Touchable';
import ChatList from '../components/ChatList';

export default function DiscoverHome() {
  const RightDom = useMemo(() => {
    return (
      <View style={GStyles.flexRow}>
        <Touchable onPress={() => navigationService.navigate('SearchPeople')}>
          <Svg icon="search" color={defaultColors.bg1} />
        </Touchable>
        <Touchable
          onPress={event => {
            const { pageX, pageY } = event.nativeEvent;
            ChatOverlay.showChatPopover(
              [
                { title: 'New Chat', onPress: () => navigationService.navigate('NewChatHome') },
                { title: 'Add Contact' },
              ],
              pageX,
              pageY,
              'left',
            );
          }}>
          <Svg icon="add2" />
        </Touchable>
      </View>
    );
  }, []);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg5]}>
      <CustomHeader noLeftDom themeType="blue" titleDom="Web3 Chat" rightDom={RightDom} />
      <ChatList chatList={[{ id: 'chat', name: 'chat' }]} />
    </SafeAreaBox>
  );
}
