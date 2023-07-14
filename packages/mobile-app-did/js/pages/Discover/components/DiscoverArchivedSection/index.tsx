import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextM, TextS } from 'components/CommonText';
import { useBookmarkList, useDiscoverJumpWithNetWork, useRecordsList } from 'hooks/discover';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Easing, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { TabView } from '@rneui/base';
import DiscoverWebsiteImage from '../DiscoverWebsiteImage';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import navigationService from 'utils/navigationService';
import { ArchivedTabEnum } from 'pages/Discover/types';
import NoDiscoverData from '../NoDiscoverData';
import { DiscoverItem } from '@portkey-wallet/store/store-ca/cms/types';
import { useFocusEffect } from '@react-navigation/native';

export function DiscoverArchivedSection() {
  const discoverJump = useDiscoverJumpWithNetWork();
  const { bookmarkList: bookmarkListStore, refresh } = useBookmarkList();

  const recordsListStore = useRecordsList(true);

  const [index, setIndex] = React.useState(
    bookmarkListStore.length ? ArchivedTabEnum.Bookmarks : ArchivedTabEnum.History,
  );

  const animateDuration = useMemo(() => (bookmarkListStore.length === 0 ? 0 : 250), [bookmarkListStore.length]);
  const bookmarkList = useMemo(() => bookmarkListStore.slice(0, 4), [bookmarkListStore]);
  const recordsList = useMemo(() => recordsListStore.slice(0, 4), [recordsListStore]);
  const isShowArchivedSections = useMemo(
    () => bookmarkList?.length > 0 || recordsList?.length > 0,
    [bookmarkList?.length, recordsList?.length],
  );

  const onSeeAllPress = useCallback(() => {
    navigationService.navigate('Bookmark', { type: index });
  }, [index]);

  const onClickJump = useCallback(
    (i: DiscoverItem) => {
      discoverJump({
        item: {
          id: Date.now(),
          name: i?.title || '',
          url: i?.url ?? i?.description,
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

  if (!isShowArchivedSections) return null;
  return (
    <View style={styles.wrap}>
      <View style={styles.headerWrap}>
        <View style={styles.archivedTabWrap}>
          <TextM
            onPress={() => setIndex(ArchivedTabEnum.Bookmarks)}
            style={[
              GStyles.marginRight(24),
              index === ArchivedTabEnum.Bookmarks ? FontStyles.weight500 : FontStyles.font3,
            ]}>
            Bookmarks
          </TextM>
          <TextM
            onPress={() => setIndex(ArchivedTabEnum.History)}
            style={index === ArchivedTabEnum.History ? FontStyles.weight500 : FontStyles.font3}>
            Records
          </TextM>
        </View>
        <TextS style={FontStyles.font4} onPress={onSeeAllPress}>
          See All
        </TextS>
      </View>
      <View style={styles.tabViewWrap}>
        <TabView
          value={index}
          disableSwipe={true}
          animationType="timing"
          animationConfig={{ duration: animateDuration, useNativeDriver: true, easing: Easing.linear }}>
          <TabView.Item style={GStyles.width100}>
            {bookmarkList?.length === 0 ? (
              <NoDiscoverData type="noBookmarks" />
            ) : (
              <View style={styles.tabListWrap}>
                {bookmarkList.map((item, idx) => (
                  <TouchableOpacity key={idx} style={styles.tabItemWrap} onPress={() => onClickJump(item)}>
                    <View style={styles.tabItemContent}>
                      <DiscoverWebsiteImage size={pTd(40)} imageUrl={getFaviconUrl(item.url)} />
                      <TextS style={GStyles.textAlignCenter} numberOfLines={2}>
                        {item.url}
                      </TextS>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </TabView.Item>
          <TabView.Item style={GStyles.width100}>
            {recordsList?.length === 0 ? (
              <NoDiscoverData type="noRecords" />
            ) : (
              <View style={styles.tabListWrap}>
                {recordsList.map((item, idx) => (
                  <TouchableOpacity key={idx} style={styles.tabItemWrap} onPress={() => onClickJump(item)}>
                    <View style={styles.tabItemContent}>
                      <DiscoverWebsiteImage size={pTd(40)} imageUrl={getFaviconUrl(item.url)} />
                      <TextS style={GStyles.textAlignCenter} numberOfLines={2}>
                        {item.url}
                      </TextS>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </TabView.Item>
        </TabView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: pTd(144),
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
    flex: 1,
  },
  tabListWrap: {
    width: '100%',
    height: '100%',
    backgroundColor: defaultColors.bg1,
    paddingHorizontal: pTd(12),
    flexDirection: 'row',
    overflow: 'hidden',
  },
  tabItemWrap: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemContent: {
    alignItems: 'center',
    maxWidth: pTd(72),
    height: pTd(76),
    justifyContent: 'space-between',
  },
});
