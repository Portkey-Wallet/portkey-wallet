import GStyles from 'assets/theme/GStyles';
import { TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useCallback, useMemo } from 'react';
import { Platform, StyleSheet, UIManager, View } from 'react-native';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import SwipeableItem, { OpenDirection } from 'react-native-swipeable-item';
import { BGStyles, DarkFontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import { darkColors } from 'assets/theme';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';
import { isDangerousLink } from '@portkey-wallet/utils/dapp/browser';

type RecordItemType = RenderItemParams<ITabItem> & {
  itemRefs: React.MutableRefObject<Map<any, any>>;
  onDelete: (item: ITabItem) => void;
};

const DELETE_BUTTON_WIDTH = pTd(98);
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}
const OVERSWIPE_DIST = 20;

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
              [...itemRefs.current.entries()].forEach(([key, ref]) => {
                if (key !== item.id && ref) {
                  ref.close();
                }
              });
            }
          }}
          overSwipe={OVERSWIPE_DIST}
          renderUnderlayLeft={renderUnderlayLeft}
          snapPointsLeft={[DELETE_BUTTON_WIDTH, DELETE_BUTTON_WIDTH]}>
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
