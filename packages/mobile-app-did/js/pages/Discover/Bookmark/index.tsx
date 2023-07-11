import React, { useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import DraggableFlatList from 'react-native-draggable-flatlist';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, View } from 'react-native';
import { BookmarkProvider, setEdit, useBookmark } from './context';
import CommonButton from 'components/CommonButton';
import BookmarkItem from './components/BookmarkItem';
import { FontStyles } from 'assets/theme/styles';

const mockData = ['1', '2', '3', '4'];

function Bookmark() {
  const [list, setList] = useState(mockData);
  const [{ isEdit }, dispatch] = useBookmark();

  const BottomBox = useMemo(
    () => (
      <View style={styles.paddingContainer}>
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
    <PageContainer scrollViewProps={{ disabled: true }} containerStyles={styles.containerStyles} titleDom="Bookmark">
      <View style={GStyles.flex1}>
        <DraggableFlatList
          data={list}
          keyExtractor={_item => _item}
          renderItem={props => <BookmarkItem {...props} />}
          onDragEnd={({ data }) => setList(data)}
        />
      </View>
      {BottomBox}
    </PageContainer>
  );
}

export default function Container() {
  return (
    <BookmarkProvider>
      <Bookmark />
    </BookmarkProvider>
  );
}

const styles = StyleSheet.create({
  // remove padding to scale item
  containerStyles: { ...GStyles.paddingArg(0) },
  paddingContainer: {
    paddingHorizontal: 16,
  },
});
