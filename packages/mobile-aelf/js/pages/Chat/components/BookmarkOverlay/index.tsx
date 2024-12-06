import React, { useCallback, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { FlatList, Keyboard, StyleSheet, View } from 'react-native';
import { TextS } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import { useBookmarkList } from '@portkey-wallet/hooks/hooks-ca/discover';
import Touchable from 'components/Touchable';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import { pTd } from 'utils/unit';
import { IBookmarkItem } from '@portkey-wallet/store/store-ca/discover/type';
import Lottie from 'lottie-react-native';
import useEffectOnce from 'hooks/useEffectOnce';
import NoData from 'components/NoData';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';

type SelectListProps = {
  onPressCallBack: (item: IBookmarkItem) => void;
};

const BookmarksOverlay = (props: SelectListProps) => {
  const { onPressCallBack } = props;
  const { bookmarkList, refresh } = useBookmarkList();
  const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

  const [initializing, setInitializing] = useState(true);
  const [totalAccount, setTotalAccount] = useState(0);

  const renderItem = useCallback(
    ({ item }: { item: IBookmarkItem }) => {
      return (
        <Touchable
          style={[GStyles.flexRow, GStyles.itemCenter, BGStyles.bg1, styles.itemWrap]}
          onPress={() => onPressCallBack(item)}>
          <DiscoverWebsiteImage
            imageUrl={getCmsWebsiteInfoImageUrl(item.url)}
            size={pTd(40)}
            style={styles.websiteIconStyle}
          />
          <View style={styles.infoWrap}>
            <TextWithProtocolIcon
              title={getCmsWebsiteInfoName(item.url) || item?.name}
              url={item.url}
              textFontSize={pTd(16)}
            />
            <TextS style={[FontStyles.font7]} numberOfLines={1} ellipsizeMode="tail">
              {item?.url}
            </TextS>
          </View>
        </Touchable>
      );
    },
    [getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName, onPressCallBack],
  );

  const fetchBookmarkList = useLockCallback(async () => {
    try {
      if (!initializing && totalAccount <= bookmarkList.length) return;
      const result = await refresh(bookmarkList.length);
      setTotalAccount(result.totalCount);
    } catch (error) {
      console.log(error);
    }
  }, [bookmarkList.length, initializing, refresh, totalAccount]);

  useEffectOnce(() => {
    (async () => {
      try {
        setInitializing(true);
        await fetchBookmarkList();
        setInitializing(false);
      } catch (error) {
        console.log(error);
      }
    })();
  });

  return (
    <ModalBody title={'Bookmarks'} modalBodyType="bottom">
      {initializing ? (
        <View style={[GStyles.marginTop(pTd(40)), GStyles.flexRow, GStyles.flexCenter]}>
          <Lottie style={styles.loadingIcon} source={require('assets/lottieFiles/loading.json')} autoPlay loop />
        </View>
      ) : (
        <FlatList
          keyExtractor={item => item.id}
          data={bookmarkList}
          onEndReached={fetchBookmarkList}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
          ListEmptyComponent={<NoData noPic message="No bookmarks" />}
          renderItem={renderItem}
        />
      )}
    </ModalBody>
  );
};

const showBookmarkList = (params: SelectListProps) => {
  console.log(params);
  Keyboard.dismiss();
  OverlayModal.show(<BookmarksOverlay {...params} />, {
    position: 'bottom',
  });
};

export default {
  showBookmarkList,
};

const styles = StyleSheet.create({
  websiteIconStyle: {
    marginRight: pTd(16),
  },
  infoWrap: {
    flex: 1,
  },
  itemWrap: {
    width: '100%',
    height: pTd(72),
    paddingHorizontal: pTd(20),
  },
  loadingIcon: {
    width: pTd(24),
    height: pTd(24),
  },
});
