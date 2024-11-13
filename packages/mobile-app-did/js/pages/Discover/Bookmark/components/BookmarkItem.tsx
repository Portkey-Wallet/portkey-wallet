import GStyles from 'assets/theme/GStyles';
import { TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import SwipeableItem, { OpenDirection, SwipeableItemImperativeRef } from 'react-native-swipeable-item';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import { darkColors } from 'assets/theme';
import myEvents from 'utils/deviceEvent';
import useEffectOnce from 'hooks/useEffectOnce';
import { IBookmarkItem } from '@portkey-wallet/store/store-ca/discover/type';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';

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

    useEffectOnce(() => {
      const listener = myEvents.bookmark.closeSwipeable.addListener(() => swipeableRef.current?.close());
      return () => listener.remove();
    });

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
          <TextM style={[FontStyles.font2]}>Delete</TextM>
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
      <ScaleDecorator activeScale={1.05}>
        <SwipeableItem
          key={item.id}
          item={props}
          ref={ref => {
            if (ref && !itemRefs.current.get(item.id)) {
              itemRefs.current.set(item.id, ref);
            }
          }}
          onChange={({ openDirection }) => {
            if (openDirection !== OpenDirection.NONE) {
              // Close all other open items
              [...itemRefs.current.entries()].forEach(([id, ref]) => {
                if (id !== item.id && ref) ref.close();
              });
            }
          }}
          overSwipe={20}
          renderUnderlayLeft={renderUnderlayLeft}
          snapPointsLeft={[pTd(98)]}>
          <Touchable onPress={onClickJump}>
            <View style={[GStyles.flexRow, GStyles.itemCenter, styles.itemRow, BGStyles.bgBase1]}>
              <DiscoverWebsiteImage imageUrl={bookmarkInfo.imageUrl} size={pTd(40)} style={styles.websiteIconStyle} />
              <View style={styles.infoWrap}>
                <TextWithProtocolIcon title={bookmarkInfo?.title} url={bookmarkInfo?.url} textFontSize={pTd(16)} />
                <TextS style={[FontStyles.font7]} numberOfLines={1} ellipsizeMode="tail">
                  {item?.url}
                </TextS>
              </View>
            </View>
          </Touchable>
        </SwipeableItem>
      </ScaleDecorator>
    );
  },
  (prevProps: RenderItemParams<IBookmarkItem>, nextProps: RenderItemParams<IBookmarkItem>) => {
    return prevProps.item.id === nextProps.item.id && prevProps.isActive === nextProps.isActive;
  },
);

const styles = StyleSheet.create({
  underlayLeftBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: pTd(24),
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
