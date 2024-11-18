import GStyles from 'assets/theme/GStyles';
import { TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { RenderItemParams } from 'react-native-draggable-flatlist';
import { BGStyles, DarkFontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import { darkColors } from 'assets/theme';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';
import { isDangerousLink } from '@portkey-wallet/utils/dapp/browser';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

type RecordItemType = RenderItemParams<ITabItem> & {
  itemRefs: React.MutableRefObject<Map<any, any>>;
  onDelete: (item: ITabItem) => void;
};

export default memo(
  function RecordItem(props: RecordItemType) {
    const { item, itemRefs, onDelete } = props;

    const discoverJump = useDiscoverJumpWithNetWork();
    const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

    const onClickJump = useCallback(
      (i: any) => {
        discoverJump({
          item: {
            name: i?.name || '',
            url: i?.url,
          },
        });
      },
      [discoverJump],
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
          <Touchable
            onPress={() => onClickJump(item)}
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
                showProtocolIcon={isDangerousLink(recordInfo.url)}
              />
              <TextS numberOfLines={1} ellipsizeMode="tail" style={[DarkFontStyles.textBase2]}>
                {item.url || ''}
              </TextS>
            </View>
          </Touchable>
        </ReanimatedSwipeable>
      </GestureHandlerRootView>
    );
  },
  (prevProps: RenderItemParams<any>, nextProps: RenderItemParams<any>) => {
    return prevProps.item === nextProps.item && prevProps.isActive === nextProps.isActive;
  },
);

const styles = StyleSheet.create({
  marginContainer: {},
  underlayLeftBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: pTd(98),
    backgroundColor: darkColors.bgDanger1,
    color: darkColors.iconDanger4,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
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
