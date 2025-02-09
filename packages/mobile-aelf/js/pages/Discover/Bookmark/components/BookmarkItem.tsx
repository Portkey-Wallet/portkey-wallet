import GStyles from 'assets/theme/GStyles';
import { TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RenderItemParams } from 'react-native-draggable-flatlist';
import { SwipeableItemImperativeRef } from 'react-native-swipeable-item';
import { BGStyles, DarkFontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import { darkColors } from 'assets/theme';
import { IBookmarkItem } from '@portkey-wallet/store/store-eoa/discover/type';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-eoa/cms';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

type BookmarkItemProps<T> = RenderItemParams<T> & {
  itemRefs: React.MutableRefObject<Map<any, any>>;
  onDelete: (item: T) => void;
};

export default memo(
  function BookmarkItem(props: BookmarkItemProps<IBookmarkItem>) {
    const { item, itemRefs, onDelete } = props;
    const swipeableRef = useRef<SwipeableItemImperativeRef>(null);
    const discoverJump = useDiscoverJumpWithNetWork();
    const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

    const onClickJump = useCallback(() => {
      discoverJump({
        item: {
          name: item?.name || '',
          url: item?.url || '',
        },
      });
    }, [discoverJump, item?.name, item?.url]);

    const deleteItem = useCallback(() => {
      swipeableRef.current?.close();
      onDelete(item);
    }, [item, onDelete]);

    const renderUnderlayLeft = useCallback(
      () => (
        <Touchable style={styles.underlayLeftBox} onPress={deleteItem}>
          <TextM style={[DarkFontStyles.textBase1]}>Delete</TextM>
        </Touchable>
      ),
      [deleteItem],
    );

    const bookmarkInfo = useMemo(() => {
      return {
        imageUrl: getCmsWebsiteInfoImageUrl(item.url || ''),
        title: getCmsWebsiteInfoName(item.url || '') || item?.name || '',
        url: item.url || '',
      };
    }, [getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName, item.name, item.url]);

    return (
      <GestureHandlerRootView>
        <ReanimatedSwipeable
          friction={2}
          enableTrackpadTwoFingerGesture
          rightThreshold={40}
          ref={ref => {
            if (ref && !itemRefs.current.get(item.id)) {
              itemRefs.current.set(item.id, ref);
            }
          }}
          onSwipeableWillOpen={() => {
            [...itemRefs.current.entries()].forEach(([key, ref]) => {
              if (key !== item.id && ref) {
                ref?.close?.();
              }
            });
          }}
          renderRightActions={renderUnderlayLeft}>
          <TouchableOpacity activeOpacity={1} onPress={onClickJump}>
            <View style={[GStyles.flexRow, GStyles.itemCenter, styles.itemRow, BGStyles.bgBase1]}>
              <DiscoverWebsiteImage imageUrl={bookmarkInfo.imageUrl} size={pTd(40)} style={styles.websiteIconStyle} />
              <View style={styles.infoWrap}>
                <TextWithProtocolIcon title={bookmarkInfo?.title} url={bookmarkInfo?.url} textFontSize={pTd(16)} />
                <TextS style={[DarkFontStyles.textBase2]} numberOfLines={1} ellipsizeMode="tail">
                  {item?.url}
                </TextS>
              </View>
            </View>
          </TouchableOpacity>
        </ReanimatedSwipeable>
      </GestureHandlerRootView>
    );
  },
  (prevProps: RenderItemParams<IBookmarkItem>, nextProps: RenderItemParams<IBookmarkItem>) => {
    return prevProps.item.id === nextProps.item.id && prevProps.isActive === nextProps.isActive;
  },
);

const styles = StyleSheet.create({
  underlayLeftBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: pTd(98),
    backgroundColor: darkColors.bgDanger1,
    color: darkColors.iconDanger4,
  },
  itemRow: {
    padding: pTd(12),
    height: pTd(72),
  },
  deleteIconWrap: {
    marginRight: pTd(16),
  },
  websiteIconStyle: {
    marginRight: pTd(16),
  },
  infoWrap: {
    flex: 1,
  },
});
