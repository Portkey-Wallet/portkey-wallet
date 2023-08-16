import React, { memo, useCallback } from 'react';
import { EmojiItem, emojiList } from './config';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { windowWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';

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
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.name + index.toString()}
        numColumns={NumColumns}
        initialNumToRender={emojiList.length}
        onEndReachedThreshold={0.2}
      />
      <Touchable style={[GStyles.center, styles.delete]} onPress={onDelete}>
        <Svg icon="chat-delete-emoji" />
      </Touchable>
    </View>
  );
}
export default memo(Emoticons, () => true);
const styles = StyleSheet.create({
  itemStyle: { color: defaultColors.font2, fontSize: pTd(30) },
  itemBoxStyle: {
    width: ItemWidth,
    ...GStyles.center,
  },
  listContent: {
    paddingBottom: pTd(40),
  },
  delete: {
    width: pTd(56),
    height: pTd(40),
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
    overflow: 'hidden',
    position: 'absolute',
    right: pTd(8),
    bottom: 0,
  },
});
