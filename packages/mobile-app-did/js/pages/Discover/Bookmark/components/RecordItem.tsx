import GStyles from 'assets/theme/GStyles';
import { TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import SwipeableItem, { OpenDirection, SwipeableItemImperativeRef } from 'react-native-swipeable-item';
import { useBookmark } from '../context/bookmarksContext';
import usePrevious from 'hooks/usePrevious';
import { BGStyles, DarkFontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import { darkColors } from 'assets/theme';
import myEvents from 'utils/deviceEvent';
import useEffectOnce from 'hooks/useEffectOnce';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';

type RecordItemType = RenderItemParams<ITabItem> & {
  itemRefs: React.MutableRefObject<Map<any, any>>;
  onDelete: (item: ITabItem) => void;
};

export default memo(
  function RecordItem(props: RecordItemType) {
    const { itemRefs, item, onDelete } = props;

    const discoverJump = useDiscoverJumpWithNetWork();
    const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

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

    const onClickJump = useCallback(
      (i: any) => {
        if (isEdit) return;

        discoverJump({
          item: {
            name: i?.name || '',
            url: i?.url,
          },
        });
      },
      [discoverJump, isEdit],
    );

    const renderUnderlayLeft = useCallback(
      () => (
        <Touchable
          style={styles.underlayLeftBox}
          onPress={() => {
            onDelete(item);
          }}>
          <TextM style={[DarkFontStyles.textBase1, GStyles.flexCol, GStyles.center]}>Delete</TextM>
        </Touchable>
      ),
      [item, onDelete],
    );

    const recordInfo = useMemo(() => {
      return {
        title: getCmsWebsiteInfoName(item.url) || item.name || '',
        imageUrl: getCmsWebsiteInfoImageUrl(item.url || ''),
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
          <Touchable
            onPress={() => onClickJump(item)}
            // disabled={!isEdit || isActive}
            style={[
              GStyles.flexRow,
              GStyles.itemCenter,
              styles.itemRow,
              BGStyles.bgBase1,
              // add margin to scale item
              styles.marginContainer,
            ]}>
            <DiscoverWebsiteImage size={pTd(40)} style={styles.websiteIconStyle} imageUrl={recordInfo.imageUrl} />
            <View style={styles.infoWrap}>
              <TextWithProtocolIcon
                title={recordInfo?.title || item.url}
                url={recordInfo?.url}
                textFontSize={pTd(16)}
              />
              <TextS numberOfLines={1} ellipsizeMode="tail" style={[DarkFontStyles.textBase2]}>
                {item.url || ''}
              </TextS>
            </View>
          </Touchable>
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
