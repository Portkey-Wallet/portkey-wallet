import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { StyleSheet, View } from 'react-native';
import BookmarkItem from './BookmarkItem';
import { darkColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { RefreshControl } from 'react-native-gesture-handler';
import NoDiscoverData from 'pages/Discover/components/NoDiscoverData';
import { useBookmarkList } from '@portkey-wallet/hooks/hooks-eoa/discover';
import { nextAnimation } from 'utils/animation';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';

import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { cleanBookmarkList } from '@portkey-wallet/store/store-eoa/discover/slice';
import { IBookmarkItem } from '@portkey-wallet/store/store-eoa/discover/type';
import CommonToast from 'components/CommonToast';
import { request } from '@portkey-wallet/api/api-did';
import Loading from 'components/Loading';
import { DISCOVER_BOOKMARK_MAX_COUNT } from 'constants/common';
import { sleep } from '@portkey-wallet/utils';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-eoa/activity';

function BookmarksSection({ onChange }: { onChange: (n: number) => void }, forward: any) {
  const [isLoading, setIsLoading] = useState(false);
  const itemRefs = useRef(new Map());
  const dispatch = useAppCommonDispatch();
  const networkType = useCurrentNetwork();

  const { refresh, clean } = useBookmarkList();
  const [list, setList] = useState<IBookmarkItem[]>([]);
  const pagerRef = useRef({
    skipCount: 0,
    maxCount: DISCOVER_BOOKMARK_MAX_COUNT,
    totalCount: 0,
  });

  const loadingRef = useRef(false);
  const getBookmarkList = useCallback(
    async (isInit: boolean) => {
      if (loadingRef.current) {
        return;
      }
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
        console.log(error, 'getBookmarkList error');
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

  const onDeleteAll = useCallback(async () => {
    Loading.show();
    try {
      // await request.discover.deleteAllBookmark();
      dispatch(cleanBookmarkList(networkType));
      setList([]);
      await sleep(100);
      getBookmarkListRef.current(true);
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
    nextAnimation();
  }, [dispatch, networkType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getBookmarkListRef.current(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [clean]);

  const onItemDelete = useCallback(async (item: IBookmarkItem) => {
    Loading.show();
    try {
      await request.discover.deleteBookmark({
        params: {
          deleteInfos: [
            {
              id: item.id,
              index: item.index,
            },
          ],
        },
      });
      setList(pre => pre.filter(ite => item.id !== ite.id));
      await sleep(100);
      getBookmarkListRef.current(true);
    } catch (error) {
      CommonToast.failError('Edit failed, please try again');
    }
    Loading.hide();
    nextAnimation();
  }, []);

  useEffect(() => {
    onChange(list.length);
  }, [list, onChange]);

  useImperativeHandle(
    forward,
    () => ({
      onDeleteAll,
    }),
    [onDeleteAll],
  );

  return (
    <View style={styles.containerStyles}>
      <View style={styles.listWrap}>
        <DraggableFlatList
          style={styles.flatListWrap}
          contentContainerStyle={[styles.flatListContent]}
          scrollEnabled
          data={list}
          keyExtractor={_item => _item.id}
          renderItem={props => <BookmarkItem onDelete={onItemDelete} itemRefs={itemRefs} {...props} />}
          refreshControl={
            <RefreshControl enabled={true} onRefresh={() => getBookmarkList(true)} refreshing={isLoading} />
          }
          onEndReached={() => getBookmarkList(false)}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
          ListEmptyComponent={<NoDiscoverData location="top" size="large" backgroundColor={darkColors.bgBase1} />}
        />
      </View>
    </View>
  );
}

export default forwardRef(BookmarksSection);

const styles = StyleSheet.create({
  // remove padding to scale item
  containerStyles: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: pTd(16),
  },
  listWrap: {
    paddingHorizontal: pTd(4),
    flex: 1,
  },
  buttonGroupWrap: {
    marginTop: pTd(16),
    paddingHorizontal: pTd(16),
  },
  deleteAll: {
    marginTop: pTd(10),
  },
  flatListWrap: {
    borderRadius: pTd(6),
    height: '100%',
  },
  flatListContent: {
    backgroundColor: darkColors.bgBase1,
    overflow: 'hidden',
  },
  flatListPadding: {
    paddingVertical: pTd(8),
  },
  buttonDisabledStyle: {
    opacity: 0.3,
  },
});
