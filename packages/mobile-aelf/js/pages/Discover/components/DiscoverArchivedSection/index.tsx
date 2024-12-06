import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextM, TextS } from 'components/CommonText';
import { useDiscoverJumpWithNetWork, useRecordsList } from 'hooks/discover';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import DiscoverWebsiteImage from '../DiscoverWebsiteImage';
import navigationService from 'utils/navigationService';
import { ArchivedTabEnum } from 'pages/Discover/types';
import NoDiscoverData from '../NoDiscoverData';
import { useFocusEffect } from '@react-navigation/native';
import { IBookmarkItem, ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { useBookmarkList } from '@portkey-wallet/hooks/hooks-ca/discover';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';
import { IRecordsItemType } from '@portkey-wallet/types/types-ca/discover';
import Touchable from 'components/Touchable';

export function DiscoverArchivedSection() {
  const discoverJump = useDiscoverJumpWithNetWork();
  const { bookmarkList: bookmarkListStore, refresh } = useBookmarkList();
  const recordsListStore = useRecordsList(true);
  const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

  const [index, setIndex] = React.useState(
    bookmarkListStore.length ? ArchivedTabEnum.Bookmarks : ArchivedTabEnum.History,
  );

  const bookmarkList = useMemo((): IBookmarkItem[] => bookmarkListStore.slice(0, 4), [bookmarkListStore]);
  const recordsList = useMemo((): IRecordsItemType[] => recordsListStore.slice(0, 4), [recordsListStore]);
  const isShowArchivedSections = useMemo(
    () => bookmarkList?.length > 0 || recordsList?.length > 0,
    [bookmarkList?.length, recordsList?.length],
  );

  const onSeeAllPress = useCallback(() => {
    navigationService.navigate('Bookmark', { type: index });
  }, [index]);

  const onClickJump = useCallback(
    (i: ITabItem | IBookmarkItem | IRecordsItemType) => {
      discoverJump({
        item: {
          name: i?.name || '',
          url: i?.url || '',
        },
      });
    },
    [discoverJump],
  );

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  useFocusEffect(
    useCallback(() => {
      if (bookmarkList?.length > 0) {
        setIndex(ArchivedTabEnum.Bookmarks);
      } else {
        setIndex(ArchivedTabEnum.History);
      }
    }, [bookmarkList?.length]),
  );

  if (!isShowArchivedSections) return null;
  return (
    <View style={styles.wrap}>
      <View style={styles.headerWrap}>
        <View style={styles.archivedTabWrap}>
          <Touchable style={GStyles.marginRight(24)} onPress={() => setIndex(ArchivedTabEnum.Bookmarks)}>
            <TextM style={[index === ArchivedTabEnum.Bookmarks ? FontStyles.weight500 : FontStyles.font3]}>
              Bookmarks
            </TextM>
          </Touchable>
          <Touchable style={GStyles.marginRight(24)} onPress={() => setIndex(ArchivedTabEnum.History)}>
            <TextM style={index === ArchivedTabEnum.History ? FontStyles.weight500 : FontStyles.font3}>Records</TextM>
          </Touchable>
        </View>
        <Touchable onPress={onSeeAllPress}>
          <TextS style={FontStyles.font4}>See All</TextS>
        </Touchable>
      </View>
      <View style={styles.tabViewWrap}>
        {index === ArchivedTabEnum.Bookmarks && (
          <>
            {bookmarkList?.length === 0 ? (
              <NoDiscoverData type="noBookmarks" style={styles.noData} />
            ) : (
              <View style={styles.tabListWrap}>
                {bookmarkList.map((item, idx) => (
                  <Touchable
                    key={idx}
                    style={[styles.tabItemWrap, idx === 0 && GStyles.marginLeft(0)]}
                    onPress={() => onClickJump(item)}>
                    <View style={styles.tabItemContent}>
                      <DiscoverWebsiteImage size={pTd(40)} imageUrl={getCmsWebsiteInfoImageUrl(item.url)} />
                      <TextS style={[styles.websiteName]} numberOfLines={2}>
                        {getCmsWebsiteInfoName(item?.url) || item?.name || item?.url}
                      </TextS>
                    </View>
                  </Touchable>
                ))}
              </View>
            )}
          </>
        )}
        {index === ArchivedTabEnum.History && (
          <>
            {recordsList?.length === 0 ? (
              <NoDiscoverData type="noRecords" style={styles.noData} />
            ) : (
              <View style={styles.tabListWrap}>
                {recordsList.map((item, idx) => (
                  <Touchable
                    key={idx}
                    style={[styles.tabItemWrap, idx === 0 && GStyles.marginLeft(0)]}
                    onPress={() => onClickJump(item)}>
                    <View style={styles.tabItemContent}>
                      <DiscoverWebsiteImage size={pTd(40)} imageUrl={getCmsWebsiteInfoImageUrl(item.url || '')} />
                      <TextS style={[styles.websiteName]} numberOfLines={2}>
                        {getCmsWebsiteInfoName(item?.url || '') || item.name || item.url}
                      </TextS>
                    </View>
                  </Touchable>
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: pTd(16),
    ...GStyles.paddingArg(0, 20),
  },
  headerWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pTd(8),
  },
  archivedTabWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tabViewWrap: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: pTd(6),
    paddingVertical: pTd(20),
    paddingHorizontal: pTd(12),
    backgroundColor: defaultColors.bg1,
    flex: 1,
  },
  tabListWrap: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  tabItemWrap: {
    marginLeft: pTd(8),
    width: pTd(72),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tabItemContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  websiteName: {
    marginTop: pTd(4),
    textAlign: 'center',
  },
  noData: {
    height: pTd(60),
  },
});
