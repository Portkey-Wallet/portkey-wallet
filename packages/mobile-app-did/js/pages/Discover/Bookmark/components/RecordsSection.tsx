import React, { useCallback, useMemo } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, View } from 'react-native';
import { BookmarkProvider, setEdit, useBookmark } from '../context/bookmarksContext';
import CommonButton from 'components/CommonButton';
import BookmarkItem from './BookmarkItem';
import { FontStyles } from 'assets/theme/styles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import NoDiscoverData from 'pages/Discover/components/NoDiscoverData';
import { useRecordsList } from 'hooks/discover';
import { removeRecordsItems, clearRecordsList } from '@portkey-wallet/store/store-ca/discover/slice';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';

// const mockData = ['1', '2', '3'];

function BookmarksSection() {
  //   const [list, setList] = useState(mockData);
  const [{ isEdit }, dispatch] = useBookmark();

  const { networkType } = useCurrentNetworkInfo();
  const storeDispatch = useAppCommonDispatch();
  const recordList = useRecordsList(true);

  const onDelete = useCallback(
    (item: ITabItem) => {
      storeDispatch(removeRecordsItems({ ids: [item.id], networkType }));
    },
    [networkType, storeDispatch],
  );

  const onDeleteAll = useCallback(() => {
    storeDispatch(clearRecordsList({ networkType }));
  }, [networkType, storeDispatch]);
  const BottomBox = useMemo(() => {
    if (recordList?.length === 0) return null;

    return (
      <View style={styles.buttonGroupWrap}>
        {isEdit ? (
          <>
            <CommonButton onPress={() => dispatch(setEdit(false))} title="Done" type="primary" />
            <CommonButton
              containerStyle={styles.deleteAll}
              titleStyle={FontStyles.font12}
              type="outline"
              title="Delete All"
              onPress={onDeleteAll}
            />
          </>
        ) : (
          <CommonButton onPress={() => dispatch(setEdit(true))} title="Edit" type="primary" />
        )}
      </View>
    );
  }, [dispatch, isEdit, onDeleteAll, recordList?.length]);

  return (
    <View style={styles.containerStyles}>
      <View style={[GStyles.flex1, styles.listWrap]}>
        <DraggableFlatList
          data={recordList}
          style={styles.flatListStyle}
          contentContainerStyle={[styles.flatListContent, recordList.length === 0 && styles.noData]}
          ListEmptyComponent={<NoDiscoverData location="top" size="large" backgroundColor={defaultColors.bg4} />}
          keyExtractor={_item => String(_item.id)}
          renderItem={props => <BookmarkItem onDelete={onDelete} {...props} />}
          onDragEnd={({ data }) => {
            console.log('===', data);
          }}
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
  },
  buttonGroupWrap: {
    paddingHorizontal: pTd(20),
  },
  deleteAll: {
    marginTop: pTd(10),
  },

  flatListStyle: {
    height: '100%',
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
  flatListContent: {
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
    paddingVertical: pTd(8),
    overflow: 'hidden',
  },
  noData: {
    paddingVertical: 0,
  },
});
