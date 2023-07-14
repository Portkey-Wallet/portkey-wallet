import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import DraggableFlatList from 'react-native-draggable-flatlist';
import GStyles from 'assets/theme/GStyles';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BookmarkProvider, setEdit, useBookmark } from '../context';
import CommonButton from 'components/CommonButton';
import BookmarkItem from './BookmarkItem';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { ArchivedTabEnum } from 'pages/Discover/types';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { TextM } from 'components/CommonText';

const mockData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

function BookmarksSection() {
  const [list, setList] = useState(mockData);
  const [{ isEdit }, dispatch] = useBookmark();

  const BottomBox = useMemo(
    () => (
      <View style={styles.buttonGroupWrap}>
        {isEdit ? (
          <>
            <CommonButton titleStyle={FontStyles.font4} type="outline" title="Delete All" />
            <CommonButton onPress={() => dispatch(setEdit(false))} title="Done" type="primary" />
          </>
        ) : (
          <CommonButton onPress={() => dispatch(setEdit(true))} title="Edit" type="primary" />
        )}
      </View>
    ),
    [dispatch, isEdit],
  );

  return (
    <View style={styles.containerStyles}>
      <View style={[GStyles.flex1, styles.listWrap]}>
        <DraggableFlatList
          scrollEnabled
          data={list}
          ListHeaderComponent={<View style={{ height: pTd(8), backgroundColor: defaultColors.bg1 }} />}
          ListFooterComponent={<View style={{ height: pTd(8), backgroundColor: defaultColors.bg1 }} />}
          keyExtractor={_item => _item}
          renderItem={props => <BookmarkItem {...props} />}
          onDragEnd={({ data }) => setList(data)}
        />
      </View>
      {BottomBox}
    </View>
  );
}

export default function Container() {
  return (
    <BookmarkProvider>
      <BookmarksSection />
    </BookmarkProvider>
  );
}

const styles = StyleSheet.create({
  // remove padding to scale item
  containerStyles: {
    flex: 1,
    justifyContent: 'space-between',
    borderRadius: pTd(6),
    paddingVertical: pTd(8),
  },
  listWrap: {
    paddingVertical: pTd(8),
    paddingHorizontal: pTd(20),
  },
  buttonGroupWrap: {
    paddingHorizontal: pTd(20),
  },
});
