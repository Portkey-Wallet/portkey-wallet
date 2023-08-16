import React, { memo, useCallback } from 'react';
import { EmojiItem, emojiList } from './config';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { windowWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';

const NumColumns = 8;
const ItemWidth = windowWidth / NumColumns;

function Emoticons({ onPress, onDelete }: { onPress?: (item: EmojiItem) => void; onDelete?: () => void }) {
  const renderItem = useCallback(
    ({ item }: { item: EmojiItem }) => {
      return (
        <TouchableOpacity onPress={() => onPress?.(item)} key={item.name} style={styles.itemBoxStyle}>
          <Text style={styles.itemStyle}>{item.code}</Text>
        </TouchableOpacity>
      );
    },
    [onPress],
  );
  return (
    <View style={GStyles.flex1}>
      <FlatList
        data={emojiList}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.name + index.toString()}
        numColumns={NumColumns}
        initialNumToRender={emojiList.length}
        onEndReachedThreshold={0.2}
      />
      <TouchableOpacity onPress={onDelete}>
        <Svg icon="delete" />
      </TouchableOpacity>
    </View>
  );
}
export default memo(Emoticons, () => true);
const styles = StyleSheet.create({
  itemStyle: { color: 'FFF', fontSize: pTd(30) },
  itemBoxStyle: {
    width: ItemWidth,
    ...GStyles.center,
  },
});
