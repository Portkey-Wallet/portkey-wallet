import { TextM } from 'components/CommonText';
import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { ListItem } from '@rneui/themed';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import CommonButton from 'components/CommonButton';

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
      leftContent={reset => (
        <View>
          <Image
            source={{ uri: 'https://lmg.jj20.com/up/allimg/1111/05161Q64001/1P516164001-3-1200.jpg' }}
            style={{ width: 40, height: 40 }}
          />
          <View>
            <TextM>Potter</TextM>
            <TextM>hello Portkey</TextM>
          </View>
        </View>
      )}
      rightContent={reset => (
        <CommonButton
          title="Delete"
          onPress={() => reset()}
          icon={{ name: 'delete', color: 'white' }}
          buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
        />
      )}>
      <Svg icon="add1" />
      <ListItem.Content>
        <ListItem.Title>Hello Swiper</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem.Swipeable>
  );
});

const styles = StyleSheet.create({
  marginContainer: {},
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
