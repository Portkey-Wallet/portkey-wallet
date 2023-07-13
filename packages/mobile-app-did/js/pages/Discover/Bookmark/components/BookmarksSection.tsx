import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import DraggableFlatList from 'react-native-draggable-flatlist';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BookmarkProvider, setEdit, useBookmark } from '../context';
import CommonButton from 'components/CommonButton';
import BookmarkItem from './BookmarkItem';
import { FontStyles } from 'assets/theme/styles';
import { ArchivedTabEnum } from 'pages/Discover/types';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { TextM } from 'components/CommonText';

const mockData = ['1', '2', '3', '4'];

function BookmarksSection() {
  const [list, setList] = useState(mockData);
  const [{ isEdit }, dispatch] = useBookmark();

  const BottomBox = useMemo(
    () => (
      <View>
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
      <View style={GStyles.flex1}>
        <DraggableFlatList
          data={list}
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
  containerStyles: { paddingHorizontal: pTd(20), flex: 1, justifyContent: 'space-between' },
});
