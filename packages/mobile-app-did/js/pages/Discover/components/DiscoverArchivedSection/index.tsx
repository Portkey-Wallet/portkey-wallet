import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextM, TextS } from 'components/CommonText';
import { useBookmarkList } from 'hooks/discover';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Easing } from 'react-native';
import { pTd } from 'utils/unit';
import { TabView } from '@rneui/base';
import DiscoverWebsiteImage from '../DiscoverWebsiteImage';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import navigationService from 'utils/navigationService';
import { ArchivedTabEnum } from 'pages/Discover/types';

export function DiscoverArchivedSection() {
  const bookmarkListStore = useBookmarkList();
  const [index, setIndex] = React.useState(
    bookmarkListStore.length ? ArchivedTabEnum.Bookmarks : ArchivedTabEnum.History,
  );

  const bookmarkList = useMemo(() => bookmarkListStore.slice(0, 4), [bookmarkListStore]);

  const onSeeAllPress = useCallback(() => {
    if (index === ArchivedTabEnum.Bookmarks) {
      navigationService.navigate('Bookmark');
      return;
    }
    // navigationService.navigate('Bookmark');
  }, [index]);

  return (
    <>
      {true && (
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
                History
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
              animationConfig={{ duration: 250, useNativeDriver: true, easing: Easing.linear }}>
              <TabView.Item style={GStyles.width100}>
                <View style={styles.tabListWrap}>
                  {bookmarkList.map((item, idx) => (
                    <View key={idx} style={styles.tabItemWrap}>
                      <View style={styles.tabItemContent}>
                        <DiscoverWebsiteImage size={pTd(40)} imageUrl={getFaviconUrl(item.url)} />
                        <TextS style={GStyles.textAlignCenter} numberOfLines={2}>
                          {item.url}
                        </TextS>
                      </View>
                    </View>
                  ))}
                </View>
              </TabView.Item>
              <TabView.Item style={GStyles.width100}>
                <TextS>History</TextS>
              </TabView.Item>
            </TabView>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: pTd(144),
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
    flex: 1,
  },
  tabListWrap: {
    width: '100%',
    height: '100%',
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
    paddingHorizontal: pTd(12),
    flexDirection: 'row',
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
