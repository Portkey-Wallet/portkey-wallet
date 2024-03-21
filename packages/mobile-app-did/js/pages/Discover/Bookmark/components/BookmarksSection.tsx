import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { StyleSheet, View } from 'react-native';
import { BookmarkProvider, setEdit, useBookmark } from '../context/bookmarksContext';
import CommonButton from 'components/CommonButton';
import BookmarkItem from './BookmarkItem';
import { FontStyles } from 'assets/theme/styles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { RefreshControl } from 'react-native-gesture-handler';
import NoDiscoverData from 'pages/Discover/components/NoDiscoverData';
import myEvents from 'utils/deviceEvent';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useBookmarkList } from '@portkey-wallet/hooks/hooks-ca/discover';
import { nextAnimation } from 'utils/animation';

import { IBookmarkItem } from '@portkey-wallet/store/store-ca/discover/type';
import CommonToast from 'components/CommonToast';
import { request } from '@portkey-wallet/api/api-did';
import Loading from 'components/Loading';
import ActionSheet from 'components/ActionSheet';
import { DISCOVER_BOOKMARK_MAX_COUNT } from 'constants/common';
import { sleep } from '@portkey-wallet/utils';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';

function BookmarksSection() {
  const [{ isEdit }, dispatch] = useBookmark();
  const [isLoading, setIsLoading] = useState(false);

  const { refresh, clean } = useBookmarkList();
  const [list, setList] = useState<IBookmarkItem[]>([]);
  const [editList, setEditList] = useState<IBookmarkItem[]>([]);
  const deleteList = useRef<IBookmarkItem[]>([]);
  const pagerRef = useRef({
    skipCount: 0,
    maxCount: DISCOVER_BOOKMARK_MAX_COUNT,
    totalCount: 0,
  });

  const loadingRef = useRef(false);
  const getBookmarkList = useCallback(
    async (isInit: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      let { skipCount } = pagerRef.current;
      const { maxCount, totalCount } = pagerRef.current;
      if (isInit) {
        skipCount = 0;
      }
      if (skipCount >= totalCount && totalCount !== 0) {
        loadingRef.current = false;
        return;
      }

      if (isInit) {
        setIsLoading(true);
      }
      try {
        console.log('getBookmarkList', skipCount, maxCount);
        const result = await refresh(skipCount, maxCount);
        console.log('getBookmarkList result', result.totalCount);
        if (isInit) {
          setList(result.items);
        } else {
          setList(pre => [...pre, ...result.items]);
        }
        pagerRef.current.skipCount = result.items.length + skipCount;
        pagerRef.current.totalCount = result.totalCount;
      } catch (error) {
        CommonToast.failError(error);
      }

      if (isInit) {
        setIsLoading(false);
      }
      loadingRef.current = false;
    },
    [refresh],
  );
  const getBookmarkListRef = useRef(getBookmarkList);
  getBookmarkListRef.current = getBookmarkList;

  useEffect(() => {
    const timer = setTimeout(() => {
      getBookmarkListRef.current(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [clean]);

  const onItemDelete = useCallback((item: IBookmarkItem) => {
    setEditList(pre => pre.filter(_item => _item.id !== item.id));
    deleteList.current.push(item);
  }, []);

  const onEdit = useCallback(() => {
    if (loadingRef.current) return;
    deleteList.current = [];
    setEditList([...list]);
    nextAnimation();
    dispatch(setEdit(true));
  }, [dispatch, list]);

  const onDone = useCallback(async () => {
    if (deleteList.current.length > 0) {
      Loading.show();
      try {
        await request.discover.deleteBookmark({
          params: {
            deleteInfos: deleteList.current.map(item => ({
              id: item.id,
              index: item.index,
            })),
          },
        });
        setList(pre => pre.filter(item => !deleteList.current.some(_item => _item.id === item.id)));
        await sleep(100);
        getBookmarkListRef.current(true);
      } catch (error) {
        CommonToast.failError('Edit failed, please try again');
      }
      Loading.hide();
    }
    nextAnimation();
    dispatch(setEdit(false));
  }, [dispatch]);

  const onDeleteAll = useCallback(() => {
    ActionSheet.alert({
      title: 'Delete all bookmarks?',
      buttons: [
        {
          title: 'Cancel',
          type: 'outline',
        },
        {
          title: 'Confirm',
          onPress: async () => {
            Loading.show();
            try {
              await request.discover.deleteAllBookmark();
              setList([]);
              await sleep(100);
              getBookmarkListRef.current(true);
            } catch (error) {
              CommonToast.failError(error);
            }
            Loading.hide();
            nextAnimation();
            dispatch(setEdit(false));
          },
        },
      ],
    });
  }, [dispatch]);

  const BottomBox = useMemo(
    () => (
      <View style={styles.buttonGroupWrap}>
        {isEdit ? (
          <>
            <CommonButton onPress={onDone} title="Done" type="primary" />
            <CommonButton
              containerStyle={[styles.deleteAll]}
              disabled={editList.length === 0}
              disabledStyle={styles.buttonDisabledStyle}
              disabledTitleStyle={FontStyles.font12}
              titleStyle={FontStyles.font12}
              type="clear"
              title="Delete All"
              onPress={onDeleteAll}
            />
          </>
        ) : (
          <CommonButton onPress={onEdit} title="Edit" type="primary" />
        )}
      </View>
    ),
    [editList.length, isEdit, onDeleteAll, onDone, onEdit],
  );
  const closeSwipeable = useLockCallback(() => myEvents.bookmark.closeSwipeable.emit(), []);
  return (
    <View style={styles.containerStyles}>
      <View style={styles.listWrap}>
        <DraggableFlatList
          style={styles.flatListWrap}
          contentContainerStyle={[
            styles.flatListContent,
            (isEdit ? editList.length !== 0 : list.length !== 0) && styles.flatListPadding,
          ]}
          scrollEnabled
          data={isEdit ? editList : list}
          onTouchStart={closeSwipeable}
          keyExtractor={_item => _item.id}
          renderItem={props => <BookmarkItem onDelete={onItemDelete} {...props} />}
          refreshControl={
            !isEdit ? (
              <RefreshControl enabled={true} onRefresh={() => getBookmarkList(true)} refreshing={isLoading} />
            ) : undefined
          }
          onEndReached={() => getBookmarkList(false)}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
          ListEmptyComponent={<NoDiscoverData location="top" size="large" backgroundColor={defaultColors.bg4} />}
        />
      </View>
      {list.length > 0 && BottomBox}
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
  flatListWrap: {
    borderRadius: pTd(6),
    height: '100%',
  },
  flatListContent: {
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
  flatListPadding: {
    paddingVertical: pTd(8),
  },
  buttonDisabledStyle: {
    opacity: 0.3,
  },
});
