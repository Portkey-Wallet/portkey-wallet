import Svg from 'components/Svg';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import { TextM } from 'components/CommonText';
import * as ImagePicker from 'expo-image-picker';

import GStyles from 'assets/theme/GStyles';

export const ActionsIcon = memo(function ActionsIcon({ onPress }: { onPress?: () => void }) {
  return <Actions onPressActionButton={onPress} icon={() => <Svg icon="add1" />} optionTintColor="#222B45" />;
});

export const EmojiIcon = memo(function EmojiIcon({ onPress }: { onPress?: () => void }) {
  return <Actions onPressActionButton={onPress} icon={() => <Svg icon="add3" />} optionTintColor="#222B45" />;
});

export const ToolBar = memo(function ToolBar() {
  return (
    <View style={GStyles.flex1}>
      <Touchable style={styles.toolsItem} onPress={() => navigationService.navigate('ChatCamera')}>
        <TextM>camera</TextM>
      </Touchable>

      <Touchable
        style={styles.toolsItem}
        onPress={async () => {
          const result = (await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            selectionLimit: 9,
            allowsMultipleSelection: true,
          })) as unknown as { uri: string };
          console.log(result);
        }}>
        <TextM>photo</TextM>
      </Touchable>

      <Touchable style={styles.toolsItem}>
        <TextM>Bookmark</TextM>
      </Touchable>
    </View>
  );
});

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
