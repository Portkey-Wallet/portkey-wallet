import React, { useCallback, useRef } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, View } from 'react-native';
import { BookmarkProvider } from '../context/bookmarksContext';
import RecordItem from './RecordItem';
import { darkColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import NoDiscoverData from 'pages/Discover/components/NoDiscoverData';
import { useRecordsList } from 'hooks/discover';
import { removeRecordsItems } from '@portkey-wallet/store/store-eoa/discover/slice';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { ITabItem } from '@portkey-wallet/store/store-eoa/discover/type';

function BookmarksSection() {
  const { networkType } = useCurrentNetworkInfo();
  const storeDispatch = useAppCommonDispatch();
  const recordList = useRecordsList(true);
  const itemRefs = useRef(new Map());

  const onAddDelete = useCallback(
    (item: ITabItem) => {
      if (item.id) {
        storeDispatch(removeRecordsItems({ ids: [item.id], networkType }));
      }
    },
    [networkType, storeDispatch],
  );

  return (
    <View style={styles.containerStyles}>
      <View style={[GStyles.flex1, styles.listWrap]}>
        <DraggableFlatList
          data={recordList}
          style={styles.flatListStyle}
          contentContainerStyle={[styles.flatListContent, recordList.length === 0 && styles.noData]}
          ListEmptyComponent={
            <NoDiscoverData type="noRecords" location="top" size="large" backgroundColor={darkColors.bgBase1} />
          }
          keyExtractor={_item => String(_item.id)}
          renderItem={props => <RecordItem onDelete={onAddDelete} itemRefs={itemRefs} {...props} />}
        />
      </View>
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
    paddingVertical: pTd(16),
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
    backgroundColor: darkColors.bgBase1,
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
