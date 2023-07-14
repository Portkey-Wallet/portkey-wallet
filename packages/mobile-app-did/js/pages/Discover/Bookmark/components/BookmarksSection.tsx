import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import DraggableFlatList from 'react-native-draggable-flatlist';
import GStyles from 'assets/theme/GStyles';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BookmarkProvider, setEdit, useBookmark } from '../context/bookmarksContext';
import CommonButton from 'components/CommonButton';
import BookmarkItem from './BookmarkItem';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { ArchivedTabEnum } from 'pages/Discover/types';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { TextM } from 'components/CommonText';
import { RefreshControl } from 'react-native-gesture-handler';
import NoDiscoverData from 'pages/Discover/components/NoDiscoverData';

// const mockData = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const mockData = ['1', '2', '3'];

function BookmarksSection() {
  const [list, setList] = useState(mockData);
  const [{ isEdit }, dispatch] = useBookmark();
  const [isLoading, setIsLoading] = useState(false);

  const getBookmarkList = useCallback(async (isInit: any) => {
    setTimeout(() => {
      console.log(123);

      // setIsLoading(true);
    }, 100);

    // const { data, maxResultCount = 10, skipCount = 0, totalRecordCount = 0 } = currentActivity;
  }, []);

  const BottomBox = useMemo(
    () => (
      <View style={styles.buttonGroupWrap}>
        {isEdit ? (
          <>
            <CommonButton onPress={() => dispatch(setEdit(false))} title="Done" type="primary" />
            <CommonButton
              containerStyle={styles.deleteAll}
              titleStyle={FontStyles.font12}
              type="outline"
              title="Delete All"
            />
          </>
        ) : (
          <CommonButton onPress={() => dispatch(setEdit(true))} title="Edit" type="primary" />
        )}
      </View>
    ),
    [dispatch, isEdit],
  );

  if (list.length === 0) return <NoDiscoverData location="top" size="large" backgroundColor={defaultColors.bg4} />;

  return (
    <View style={styles.containerStyles}>
      <View style={styles.listWrap}>
        <DraggableFlatList
          style={styles.flatListWrap}
          contentContainerStyle={styles.flatListContent}
          scrollEnabled
          data={list}
          keyExtractor={_item => _item}
          renderItem={props => <BookmarkItem {...props} />}
          refreshControl={
            <RefreshControl enabled={true} onRefresh={() => getBookmarkList(true)} refreshing={isLoading} />
          }
          onEndReached={() => getBookmarkList(123)}
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
  },
  listWrap: {
    paddingHorizontal: pTd(20),
    flex: 1,
  },
  buttonGroupWrap: {
    marginTop: pTd(16),
    paddingHorizontal: pTd(20),
  },
  deleteAll: {
    marginTop: pTd(10),
  },
  flatListWrap: { height: '100%', borderRadius: pTd(6), overflow: 'hidden' },
  flatListContent: {
    backgroundColor: defaultColors.bg1,
    paddingVertical: pTd(8),
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
});
