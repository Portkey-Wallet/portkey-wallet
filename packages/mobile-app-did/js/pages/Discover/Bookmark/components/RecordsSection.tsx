import React, { useCallback, useMemo, useState } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, View } from 'react-native';
import { BookmarkProvider, setEdit, useBookmark } from '../context/bookmarksContext';
import CommonButton from 'components/CommonButton';
import RecordItem from './RecordItem';
import { FontStyles } from 'assets/theme/styles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import NoDiscoverData from 'pages/Discover/components/NoDiscoverData';
import { useRecordsList } from 'hooks/discover';
import { removeRecordsItems, clearRecordsList } from '@portkey-wallet/store/store-ca/discover/slice';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import ActionSheet from 'components/ActionSheet';
import { nextAnimation } from 'utils/animation';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import myEvents from 'utils/deviceEvent';

function BookmarksSection() {
  const [{ isEdit }, dispatch] = useBookmark();

  const { networkType } = useCurrentNetworkInfo();
  const storeDispatch = useAppCommonDispatch();
  const recordList = useRecordsList(true);

  const [deleteIdMap, setDeleteIdsMap] = useState<{ [key: number]: number }>({});

  const onAddDelete = useCallback(
    (item: ITabItem) => {
      deleteIdMap[item.id] = item.id;
      setDeleteIdsMap(JSON.parse(JSON.stringify(deleteIdMap)));
    },
    [deleteIdMap],
  );

  const onDone = useCallback(() => {
    nextAnimation();
    dispatch(setEdit(false));
    const ids = Object.keys(deleteIdMap).map(ele => Number(ele));
    if (ids.length > 0) {
      storeDispatch(removeRecordsItems({ ids: ids, networkType }));
      setDeleteIdsMap({});
    }
  }, [deleteIdMap, dispatch, networkType, storeDispatch]);

  const onDeleteAll = useCallback(() => {
    ActionSheet.alert({
      title: `Delete all records?`,
      buttons: [
        { title: 'Cancel', type: 'outline' },
        { title: 'Confirm', type: 'primary', onPress: () => storeDispatch(clearRecordsList({ networkType })) },
      ],
    });
  }, [networkType, storeDispatch]);

  const recordListShow = useMemo(() => recordList.filter(ele => !deleteIdMap[ele.id]), [deleteIdMap, recordList]);

  const BottomBox = useMemo(() => {
    if (recordList?.length === 0) return null;
    return (
      <View style={styles.buttonGroupWrap}>
        {isEdit ? (
          <>
            <CommonButton onPress={onDone} title="Done" type="primary" />
            <CommonButton
              disabled={recordListShow.length === 0}
              disabledTitleStyle={FontStyles.font12}
              disabledStyle={styles.buttonDisabledStyle}
              containerStyle={styles.deleteAll}
              titleStyle={FontStyles.font12}
              type="clear"
              title="Delete All"
              onPress={onDeleteAll}
            />
          </>
        ) : (
          <CommonButton
            onPress={() => {
              nextAnimation();
              dispatch(setEdit(true));
            }}
            title="Edit"
            type="primary"
          />
        )}
      </View>
    );
  }, [dispatch, isEdit, onDeleteAll, onDone, recordList?.length, recordListShow.length]);

  const closeSwipeable = useLockCallback(() => myEvents.bookmark.closeSwipeable.emit(), []);

  return (
    <View style={styles.containerStyles}>
      <View style={[GStyles.flex1, styles.listWrap]}>
        <DraggableFlatList
          data={recordListShow}
          style={styles.flatListStyle}
          contentContainerStyle={[styles.flatListContent, recordListShow.length === 0 && styles.noData]}
          ListEmptyComponent={
            <NoDiscoverData type="noRecords" location="top" size="large" backgroundColor={defaultColors.bg4} />
          }
          keyExtractor={_item => String(_item.id)}
          renderItem={props => <RecordItem onDelete={onAddDelete} {...props} />}
          onTouchStart={closeSwipeable}
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
    paddingBottom: pTd(18),
  },
  listWrap: {
    paddingHorizontal: pTd(4),
  },
  buttonGroupWrap: {
    paddingHorizontal: pTd(16),
  },
  deleteAll: {
    marginTop: pTd(10),
  },
  flatListStyle: {
    height: '100%',
    borderRadius: pTd(6),
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
  buttonDisabledStyle: {
    opacity: 0.3,
  },
});
