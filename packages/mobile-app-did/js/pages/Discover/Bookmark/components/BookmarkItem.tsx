import GStyles from 'assets/theme/GStyles';
import { TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import SwipeableItem, { OpenDirection, SwipeableItemImperativeRef } from 'react-native-swipeable-item';
import { useBookmark } from '../context/bookmarksContext';
import usePrevious from 'hooks/usePrevious';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import { defaultColors } from 'assets/theme';
import myEvents from 'utils/deviceEvent';
import useEffectOnce from 'hooks/useEffectOnce';
import { IBookmarkItem } from '@portkey-wallet/store/store-ca/discover/type';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { DiscoverItem } from '@portkey-wallet/store/store-ca/cms/types';

type BookmarkItemProps<T> = RenderItemParams<T> & {
  onDelete: (item: T) => void;
};

export default memo(
  function BookmarkItem(props: BookmarkItemProps<IBookmarkItem>) {
    const { drag, isActive, item, onDelete } = props;
    const swipeableRef = useRef<SwipeableItemImperativeRef>(null);
    const [{ isEdit }] = useBookmark();
    const preIsEdit = usePrevious(isEdit);
    useEffect(() => {
      if (!isEdit && isEdit !== preIsEdit) swipeableRef.current?.close();
    }, [preIsEdit, isEdit]);
    useEffectOnce(() => {
      const listener = myEvents.bookmark.closeSwipeable.addListener(() => swipeableRef.current?.close());
      return () => listener.remove();
    });
    const discoverJump = useDiscoverJumpWithNetWork();

    const onClickJump = useCallback(() => {
      if (isEdit) return;
      discoverJump({
        item: {
          id: Date.now(),
          name: item?.name || '',
          url: item?.url || '',
        },
      });
    }, [discoverJump, isEdit, item?.name, item?.url]);

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

    const EditDom = useMemo(() => {
      if (!isEdit) return null;
      return (
        <Touchable
          style={styles.deleteIconWrap}
          onPress={() => {
            myEvents.bookmark.closeSwipeable.emit();
            swipeableRef.current?.open(OpenDirection.LEFT);
          }}>
          <Svg icon="red-delete" size={pTd(20)} />
        </Touchable>
      );
    }, [isEdit]);

    return (
      <ScaleDecorator activeScale={1.05}>
        <SwipeableItem
          key={item.id}
          item={props}
          ref={swipeableRef}
          swipeEnabled={false}
          snapPointsLeft={[80]}
          renderUnderlayLeft={renderUnderlayLeft}>
          <Touchable onPress={onClickJump}>
            <View
              // disabled={!isEdit || isActive}
              style={[
                GStyles.flexRow,
                GStyles.itemCenter,
                styles.itemRow,
                BGStyles.bg1,
                // add margin to scale item
                styles.marginContainer,
              ]}>
              {EditDom}
              <DiscoverWebsiteImage imageUrl={getFaviconUrl(item.url)} size={pTd(40)} style={styles.websiteIconStyle} />
              <View style={styles.infoWrap}>
                <TextWithProtocolIcon title={item.name} url={item.url} textFontSize={pTd(16)} />
                <TextS style={[FontStyles.font7]} numberOfLines={1} ellipsizeMode="tail">
                  {item.url}
                </TextS>
              </View>

              {/* <Touchable onPressIn={drag} disabled={!isEdit || isActive}>
              <TextM>drag</TextM>
            </Touchable> */}
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
  marginContainer: {},
  underlayLeftBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
    justifyContent: 'flex-end',
    backgroundColor: defaultColors.bg17,
    color: defaultColors.font1,
    textAlign: 'center',
  },
  itemRow: {
    padding: pTd(12),
    height: pTd(72),
    // marginVertical: 10,
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
