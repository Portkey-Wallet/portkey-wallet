import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';

import GStyles from 'assets/theme/GStyles';
import Emoticons from '../Emoticons';
import { BGStyles } from 'assets/theme/styles';
import { useBottomBarStatus, useChatsDispatch, useLatestText } from '../../context/hooks';
import { ChatBottomBarStatus } from 'store/chat/slice';
import { ToolBar } from '../ToolBar';
import { setChatText } from '../../context/chatsContext';

export function AccessoryBar() {
  const bottomBarStatus = useBottomBarStatus();
  const dispatch = useChatsDispatch();
  const latestText = useLatestText();
  const showTools = useMemo(() => !!bottomBarStatus, [bottomBarStatus]);
  return (
    <View style={!showTools ? styles.hide : GStyles.flex1}>
      <View
        style={[
          BGStyles.bg4,
          bottomBarStatus === ChatBottomBarStatus.emoji ? undefined : styles.hide,
          styles.absolute,
        ]}>
        <Emoticons onPress={item => dispatch(setChatText(latestText.current + item.code))} />
      </View>
      <ToolBar />
    </View>
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
