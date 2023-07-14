import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import DraggableFlatList from 'react-native-draggable-flatlist';
import GStyles from 'assets/theme/GStyles';
import { FlatList, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { BookmarkProvider, setEdit, useBookmark } from '../context';
import CommonButton from 'components/CommonButton';
import BookmarkItem from './BookmarkItem';
import { FontStyles } from 'assets/theme/styles';
import { ArchivedTabEnum } from 'pages/Discover/types';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { TextM } from 'components/CommonText';
import { RefreshControl } from 'react-native-gesture-handler';

const mockData = ['1', '2', '3', '4', '5', '6', '7'];

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
          style={{ height: '100%', paddingHorizontal: pTd(20) }}
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
  containerStyles: { flex: 1, justifyContent: 'space-between' },
});
