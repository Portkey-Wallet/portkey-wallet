import { TextM } from 'components/CommonText';
import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { ListItem } from '@rneui/themed';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import { BGStyles } from 'assets/theme/styles';
import ChatOverlay from '../ChatOverlay';

type ChatListItemProps<T> = {
  onDelete: () => void;
};

export default memo(function ChatListItem(props: ChatListItemProps<any>) {
  const { onDelete } = props;

  const deleteItem = useCallback(() => {
    onDelete();
  }, [onDelete]);

  return (
    <ListItem.Swipeable
      style={styles.itemWrap}
      onLongPress={event => {
        const { pageX, pageY } = event.nativeEvent;
        ChatOverlay.showChatPopover([{ title: '1111111' }, { title: '22222222' }], pageX, pageY, 'left');
      }}
      onPress={() => navigationService.navigate('ChatDetails')}
      rightContent={reset => (
        <CommonButton
          title="Delete"
          onPress={() => reset()}
          icon={{ name: 'delete', color: 'white' }}
          buttonStyle={{ height: '100%', backgroundColor: 'red' }}
        />
      )}>
      <ListItem.Content style={[GStyles.flexRow, GStyles.spaceBetween]}>
        <View style={GStyles.flexRow}>
          <Image
            source={{ uri: 'https://lmg.jj20.com/up/allimg/1111/05161Q64001/1P516164001-3-1200.jpg' }}
            style={{ width: 40, height: 40 }}
          />
          <View>
            <TextM>Potter</TextM>
            <TextM>hello Portkey</TextM>
          </View>
        </View>
        <View>
          <View style={GStyles.flexRow}>
            <Svg icon="desk-mac" />
            <TextM>16:00</TextM>
          </View>
          <TextM style={BGStyles.bg10}>99+</TextM>
        </View>
      </ListItem.Content>
    </ListItem.Swipeable>
  );
});

const styles = StyleSheet.create({
  itemWrap: {
    borderBottomColor: 'green',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  underlayLeftBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
    justifyContent: 'flex-end',
    backgroundColor: defaultColors.bg17,
    color: defaultColors.font1,
    textAlign: 'center',
  },
  itemRow: {
    padding: pTd(12),
    height: pTd(72),
  },
  deleteIconWrap: {
    marginRight: pTd(16),
  },
  websiteIconStyle: {
    marginRight: pTd(16),
  },
  infoWrap: {
    flex: 1,
  },
});
