import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import Collapsible from 'components/Collapsible';
import NFTAvatar from 'components/NFTAvatar';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import Svg from 'components/Svg';
import { TextL, TextM, TextS } from 'components/CommonText';
import { NFTCollectionItemShowType } from '@portkey-wallet/types/types-ca/assets';
import Touchable from 'components/Touchable';
import { OpenCollectionObjType } from './index';
import { ChainId } from '@portkey-wallet/types';

import { Skeleton } from '@rneui/base';
import { makeStyles } from '@rneui/themed';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { PortkeyLinearGradientV2 } from 'components/PortkeyLinearGradient';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';

export enum NoDataMessage {
  CustomNetWorkNoData = 'No transaction records accessible from the current custom network',
  CommonNoData = 'You have no transactions',
}

export type NFTItemPropsType = NFTCollectionItemShowType & {
  isFetching?: boolean;
  collapsed?: boolean;
  openCollectionObj: OpenCollectionObjType;
  setOpenCollectionObj: any;
  openItem: (symbol: string, chainId: ChainId, itemCount: number) => void;
  closeItem: (symbol: string, chainId: ChainId) => void;
  loadMoreItem: (symbol: string, chainId: ChainId, pageNum: number) => void;
};

export default function NFTItem(props: NFTItemPropsType) {
  const {
    isFetching,
    chainId,
    collectionName,
    imageUrl,
    chainImageUrl,
    displayChainImage,
    itemCount,
    children,
    symbol,
    collapsed,
    openCollectionObj,
    openItem,
    closeItem,
  } = props;
  const styles = getStyles();

  const [open, setOpen] = useState<boolean>(false);

  const openCollectionInfo = useMemo(
    () => openCollectionObj?.[`${symbol}${chainId}`],
    [chainId, openCollectionObj, symbol],
  );

  useEffect(() => {
    setOpen(!collapsed);
  }, [collapsed]);

  const showChildren = useMemo(
    () => (children.length > 8 ? children.slice(0, ((openCollectionInfo?.pageNum ?? 0) + 1) * 8) : children),
    [children, openCollectionInfo?.pageNum],
  );

  const hasMore = useMemo(
    () => showChildren?.length !== 0 && showChildren?.length < itemCount && !isFetching,
    [isFetching, itemCount, showChildren?.length],
  );

  const skeletonList = useMemo(() => {
    if (!isFetching) return [];

    const count = itemCount - showChildren?.length >= 9 ? 9 : itemCount - showChildren?.length;
    return count > 0 ? new Array(count).fill('-') : [];
  }, [isFetching, itemCount, showChildren?.length]);

  return (
    <View style={styles.wrap}>
      <Touchable
        onPressWithSecond={800}
        style={[styles.topSeries]}
        onPress={() => {
          if (openCollectionObj?.[`${symbol}${chainId}`]) {
            closeItem(symbol, chainId);
          } else {
            openItem(symbol, chainId, itemCount);
          }
        }}>
        <View>
          <CommonAvatar avatarSize={pTd(24)} imageUrl={imageUrl} title={collectionName} shapeType={'square'} />
          {displayChainImage && (
            <CommonAvatar
              hasBorder
              style={styles.chainIcon}
              title={''}
              avatarSize={pTd(16)}
              imageUrl={chainImageUrl}
              titleStyle={styles.tokenIconTitle}
              borderStyle={styles.iconBorder}
            />
          )}
        </View>
        <TextL style={[styles.nftSeriesName, styles.title]} ellipsizeMode="tail" numberOfLines={1}>
          {collectionName}
        </TextL>
        <TextL style={[styles.nftSeriesName, styles.itemCount]}>{itemCount}</TextL>
        <Svg
          icon={'chevron_down'}
          size={pTd(24)}
          iconStyle={[
            styles.touchIcon,
            {
              transform: [{ rotate: !open ? '180deg' : '0deg' }],
            },
          ]}
        />
      </Touchable>
      <Collapsible collapsed={!open}>
        <View style={[styles.listWrap]}>
          {showChildren?.map((ele: any, index: number) => (
            <Touchable
              style={[
                styles.itemWrapper,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  marginRight: index % 3 === 2 ? 0 : pTd(16),
                  marginTop: index < 3 ? 0 : pTd(16),
                },
              ]}
              key={ele.symbol}
              onPress={() => {
                navigationService.navigate('NFTDetail', {
                  ...ele,
                  collectionInfo: { imageUrl, collectionName, itemCount, symbol, chainId },
                });
              }}>
              <NFTAvatar
                disabled
                isSeed={ele.isSeed}
                seedType={ele.seedType}
                badgeSizeType="normal"
                data={ele}
                nftSize={(screenWidth - pTd(4 * 16)) / 3}
                style={[
                  styles.itemAvatarStyle,
                  index < 3 ? styles.marginTop0 : {},
                  index % 3 === 2 ? styles.marginRight0 : {},
                ]}
              />
              <TextM numberOfLines={1} ellipsizeMode="tail" style={[GStyles.marginTop(8)]}>
                {ele.alias}
              </TextM>

              <TextS numberOfLines={1} style={styles.itemAmount}>
                {ele.balance && ele.decimals
                  ? formatTokenAmountShowWithDecimals(ele.balance, ele.decimals)
                  : `#${ele.tokenId}`}
              </TextS>
            </Touchable>
          ))}
          {hasMore && (
            <Touchable
              style={[styles.itemWrapper, GStyles.marginTop(16)]}
              onPress={() => {
                navigationService.navigate('CollectionDetail', {
                  imageUrl,
                  collectionName,
                  itemCount,
                  symbol,
                  chainId,
                });
              }}>
              <View style={[styles.itemAvatarStyle, styles.viewAll]}>
                <Svg icon="arrow-right-thin" size={pTd(24)} />
                <TextM style={styles.vieAllText}>View all</TextM>
              </View>
            </Touchable>
          )}
          {skeletonList.map((ele, i) => {
            return (
              <Skeleton
                key={i}
                animation="wave"
                LinearGradientComponent={() => <PortkeyLinearGradientV2 />}
                style={[
                  styles.itemWrapper,
                  styles.skeleton,
                  // eslint-disable-next-line react-native/no-inline-styles
                  { marginRight: i % 3 === 2 ? 0 : pTd(16), marginTop: i < 3 ? 0 : pTd(16) },
                ]}
                height={(screenWidth - pTd(4 * 16)) / 3}
                width={(screenWidth - pTd(4 * 16)) / 3}
              />
            );
          })}
        </View>
      </Collapsible>
    </View>
  );
}
const getStyles = makeStyles(theme => ({
  wrap: {
    width: '100%',
    backgroundColor: theme.colors.bgBase2,
  },
  title: {
    color: theme.colors.textBase1,
    flex: 1,
    fontWeight: '400',
    marginLeft: pTd(8),
  },
  itemCount: {
    color: theme.colors.textBase1,
    fontWeight: '400',
    opacity: 0.7,
  },
  topSeries: {
    ...GStyles.flexRowWrap,
    alignItems: 'center',
  },
  itemWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: (screenWidth - pTd(4 * 16)) / 3,
    // backgroundColor: 'red',
  },
  viewAll: {
    borderRadius: pTd(8),
    width: pTd(110),
    height: pTd(110),
    backgroundColor: theme.colors.bgBase3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vieAllText: {
    color: theme.colors.textBase1,
    opacity: 0.4,
  },
  listWrap: {
    ...GStyles.flexRowWrap,
    marginTop: pTd(16),
  },
  touchIcon: {
    marginLeft: pTd(8),
  },
  topSeriesCenter: {
    flex: 1,
    paddingLeft: pTd(10),
  },
  nftSeriesName: {
    lineHeight: pTd(22),
  },
  nftSeriesChainInfo: {
    lineHeight: pTd(16),
    color: defaultColors.font11,
  },
  itemAvatarStyle: {
    marginRight: pTd(8) - StyleSheet.hairlineWidth,
    marginTop: pTd(8),
    backgroundColor: defaultColors.bg4,
  },
  noMarginRight: {
    marginRight: 0,
  },
  loadMore: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingLeft: pTd(44),
    paddingRight: pTd(21),
    textAlign: 'center',
    marginTop: pTd(16),
  },
  downArrow: {
    marginLeft: pTd(4),
  },
  divider: {
    width: '100%',
    marginTop: pTd(16),
    marginLeft: pTd(44),
    height: 0,
  },
  marginBottom0: {
    marginBottom: 0,
  },
  marginTop0: {
    marginTop: 0,
  },
  marginRight0: {
    marginRight: 0,
  },
  itemAmount: {
    marginTop: pTd(4),
    opacity: 0.4,
    color: theme.colors.textBase1,
  },
  skeleton: {
    borderRadius: pTd(8),
    backgroundColor: theme.colors.bgBase3,
  },
  iconBorder: {
    borderColor: theme.colors.borderBase1,
  },
  tokenIconTitle: {
    fontSize: pTd(10),
  },
  chainIcon: {
    position: 'absolute',
    right: -pTd(4),
    bottom: -pTd(2),
  },
}));
