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
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';

type BookmarkItemType = RenderItemParams<any> & { onDelete: (item: { id: string; [key: string]: any }) => void };

export default memo(
  function BookmarkItem(props: BookmarkItemType) {
    const { item, onDelete } = props;
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
    const renderUnderlayLeft = useCallback(
      () => (
        <Touchable
          style={styles.underlayLeftBox}
          onPress={() => {
            onDelete(item);
          }}>
          <TextM style={[FontStyles.font2, GStyles.flexCol, GStyles.center]}>Delete</TextM>
        </Touchable>
      ),
      [],
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
            <DiscoverWebsiteImage
              size={pTd(40)}
              style={styles.websiteIconStyle}
              imageUrl={getFaviconUrl(item?.url || '')}
            />
            <View style={styles.infoWrap}>
              <TextWithProtocolIcon url={item.url} textFontSize={pTd(16)} />
              <TextS style={[FontStyles.font7]}>{item.url}</TextS>
            </View>

            {/* <Touchable onPressIn={drag} disabled={!isEdit || isActive}>
              <TextM>drag</TextM>
            </Touchable> */}
          </View>
        </SwipeableItem>
      </ScaleDecorator>
    );
  },
  (prevProps: RenderItemParams<any>, nextProps: RenderItemParams<any>) => {
    return prevProps.item === nextProps.item && prevProps.isActive === nextProps.isActive;
  },
);

const styles = StyleSheet.create({
  marginContainer: {},
  underlayLeftBox: {
    flex: 1,
    paddingRight: pTd(12),
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
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
