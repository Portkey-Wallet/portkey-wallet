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
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';

type RecordItemType = RenderItemParams<ITabItem> & { onDelete: (item: ITabItem) => void };

export default memo(
  function RecordItem(props: RecordItemType) {
    const { item, onDelete } = props;

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
          <TextM style={[FontStyles.font2, GStyles.flexCol, GStyles.center]}>Delete</TextM>
        </Touchable>
      ),
      [item, onDelete],
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

    const recordInfo = useMemo(() => {
      return {
        title: getCmsWebsiteInfoName(item.url || ''),
        imageUrl: getCmsWebsiteInfoImageUrl(item.url || ''),
      };
    }, [getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName, item.url]);

    return (
      <ScaleDecorator activeScale={1.05}>
        <SwipeableItem
          key={item.id}
          item={props}
          ref={swipeableRef}
          swipeEnabled={false}
          snapPointsLeft={[80]}
          renderUnderlayLeft={renderUnderlayLeft}>
          <Touchable
            onPress={() => onClickJump(item)}
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
            <DiscoverWebsiteImage size={pTd(40)} style={styles.websiteIconStyle} imageUrl={recordInfo.imageUrl} />
            <View style={styles.infoWrap}>
              <TextWithProtocolIcon url={item?.url} title={recordInfo?.title || item.url} textFontSize={pTd(16)} />
              <TextS numberOfLines={1} ellipsizeMode="tail" style={[FontStyles.font7]}>
                {recordInfo?.title || item.url}
              </TextS>
            </View>

            {/* <Touchable onPressIn={drag} disabled={!isEdit || isActive}>
              <TextM>drag</TextM>
            </Touchable> */}
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
    paddingRight: pTd(16),
    backgroundColor: defaultColors.bg17,
    color: defaultColors.font1,
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
