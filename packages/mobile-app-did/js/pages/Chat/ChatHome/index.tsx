import React, { useMemo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';

import { pTd } from 'utils/unit';

import navigationService from 'utils/navigationService';
import ChatListItem from '../components/ChatHomeListItem';
import Svg from 'components/Svg';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import CustomHeader from 'components/CustomHeader';
import ChatOverlay from '../components/ChatOverlay';
import Touchable from 'components/Touchable';

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
      <FlatList
        style={BGStyles.bg1}
        data={new Array(20)}
        renderItem={() => <ChatListItem onDelete={() => console.log('delete')} />}
      />
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg4,
    paddingHorizontal: 0,
    paddingBottom: 0,
    flex: 1,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  svgWrap: {
    padding: pTd(16),
  },
});
