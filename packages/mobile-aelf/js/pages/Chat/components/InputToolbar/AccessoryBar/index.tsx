import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import GStyles from 'assets/theme/GStyles';
import Emoticons from '../Emoticons';
import { BGStyles } from 'assets/theme/styles';
import { useBottomBarStatus, useChatsDispatch } from '../../../context/hooks';
import { ChatBottomBarStatus } from 'store/chat/slice';
import { ToolBar } from '../ToolBar';
import { handleDeleteText, handleInputText } from 'pages/Chat/utils';
import { setChatText } from '../../../context/chatsContext';
import { EmojiItem } from '../Emoticons/config';

export const AccessoryBar = memo(
  function AccessoryBar() {
    const bottomBarStatus = useBottomBarStatus();
    const dispatch = useChatsDispatch();
    const showTools = useMemo(() => !!bottomBarStatus, [bottomBarStatus]);
    const onPress = useCallback(
      (item: EmojiItem) => {
        const text = handleInputText(item.code);
        dispatch(setChatText(text));
      },
      [dispatch],
    );
    const onDelete = useCallback(() => {
      const text = handleDeleteText();
      dispatch(setChatText(text));
    }, [dispatch]);
    return (
      <View style={!showTools ? styles.hide : GStyles.flex1}>
        <View
          style={[
            BGStyles.bg4,
            bottomBarStatus === ChatBottomBarStatus.emoji ? undefined : styles.hide,
            styles.absolute,
          ]}>
          <Emoticons onPress={onPress} onDelete={onDelete} />
        </View>
        <ToolBar style={bottomBarStatus === ChatBottomBarStatus.tools ? undefined : styles.hide} />
      </View>
    );
  },
  () => true,
);

const styles = StyleSheet.create({
  hide: {
    width: 0,
    height: 0,
    overflow: 'hidden',
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
