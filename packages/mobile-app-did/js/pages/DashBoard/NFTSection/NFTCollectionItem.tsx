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
import { TextL, TextM, TextS, TextXL } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { NFTCollectionItemShowType } from '@portkey-wallet/types/types-ca/assets';
import Touchable from 'components/Touchable';
import { OpenCollectionObjType } from './index';
import { ChainId } from '@portkey-wallet/types';

import { Skeleton } from '@rneui/base';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { PortkeyLinearGradient } from 'components/PortkeyLinearGradient';

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
    itemCount,
    children,
    symbol,
    collapsed,
    openCollectionObj,
    openItem,
    closeItem,
    loadMoreItem,
  } = props;
  const { currentNetwork } = useWallet();

  const [open, setOpen] = useState<boolean>(false);

  const openCollectionInfo = useMemo(
    () => openCollectionObj?.[`${symbol}${chainId}`],
    [chainId, openCollectionObj, symbol],
  );

  useEffect(() => {
    setOpen(!collapsed);
  }, [collapsed]);

  const showChildren = useMemo(
    () => (children.length > 9 ? children.slice(0, ((openCollectionInfo?.pageNum ?? 0) + 1) * 9) : children),
    [children, openCollectionInfo?.pageNum],
  );

  const hasMore = useMemo(
    () => showChildren?.length !== 0 && showChildren?.length < itemCount,
    [itemCount, showChildren?.length],
  );

  const skeletonList = useMemo(() => {
    if (!isFetching) return [];

    const count = itemCount - showChildren?.length >= 9 ? 9 : itemCount - showChildren?.length;
    return new Array(count).fill('-');
  }, [isFetching, itemCount, showChildren?.length]);

  return (
    <View style={styles.wrap}>
      <Touchable
        onPressWithSecond={0}
        style={[styles.topSeries]}
        onPress={() => {
          if (openCollectionObj?.[`${symbol}${chainId}`]) {
            closeItem(symbol, chainId);
          } else {
            openItem(symbol, chainId, itemCount);
          }
        }}>
        <Svg
          icon={!open ? 'right-arrow' : 'down-arrow'}
          size={pTd(16)}
          color={defaultColors.font3}
          iconStyle={styles.touchIcon}
        />
        <CommonAvatar avatarSize={pTd(36)} imageUrl={imageUrl} title={collectionName} shapeType={'square'} />
        <View style={styles.topSeriesCenter}>
          <TextL style={styles.nftSeriesName} ellipsizeMode="tail">
            {collectionName}
          </TextL>
          <TextS style={styles.nftSeriesChainInfo}>{formatChainInfoToShow(chainId, currentNetwork)}</TextS>
        </View>
        <View>
          <TextXL style={styles.nftSeriesName}>{itemCount}</TextXL>
          <TextM style={styles.nftSeriesChainInfo} />
        </View>
      </Touchable>
      <Collapsible collapsed={!open}>
        <View style={[styles.listWrap]}>
          {showChildren?.map((ele: any, index: number) => (
            <NFTAvatar
              showNftDetailInfo
              isSeed={ele.isSeed}
              seedType={ele.seedType}
              badgeSizeType="normal"
              key={ele.symbol}
              data={ele}
              style={[
                styles.itemAvatarStyle,
                index < 3 ? styles.marginTop0 : {},
                index % 3 === 2 ? styles.marginRight0 : {},
              ]}
              onPress={() => {
                navigationService.navigate('NFTDetail', { ...ele, collectionInfo: { imageUrl, collectionName } });
              }}
            />
          ))}
          {skeletonList.map((ele, i) => {
            return (
              <Skeleton
                key={i}
                animation="wave"
                LinearGradientComponent={() => <PortkeyLinearGradient />}
                style={[
                  { borderRadius: pTd(8) },
                  styles.itemAvatarStyle,
                  i + showChildren.length < 3 ? styles.marginTop0 : {},
                  (i + showChildren.length) % 3 === 2 ? styles.marginRight0 : {},
                ]}
                height={pTd(98)}
                width={pTd(98)}
              />
            );
          })}
        </View>
        {hasMore && (
          <Touchable
            style={[styles.loadMore]}
            onPress={() => loadMoreItem?.(symbol, chainId, openCollectionInfo?.pageNum + 1)}>
            <TextM style={FontStyles.font4}>More</TextM>
            <Svg icon="down-arrow" size={pTd(16)} color={defaultColors.primaryColor} iconStyle={styles.downArrow} />
          </Touchable>
        )}
      </Collapsible>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    backgroundColor: defaultColors.bg1,
  },
  itemWrap: {
    width: '100%',
    height: pTd(100),
    ...GStyles.marginArg(24, 20),
  },

  topSeries: {
    ...GStyles.flexRowWrap,
    alignItems: 'center',
    ...GStyles.marginArg(24, 20, 0),
  },
  listWrap: {
    ...GStyles.flexRowWrap,
    paddingLeft: pTd(44),
    paddingRight: pTd(20),
    marginTop: pTd(16),
  },
  touchIcon: {
    marginRight: pTd(10),
  },
  topSeriesCenter: {
    flex: 1,
    paddingLeft: pTd(12),
  },
  nftSeriesName: {
    lineHeight: pTd(22),
  },
  nftSeriesChainInfo: {
    marginTop: pTd(4),
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
    marginTop: pTd(24),
    marginLeft: pTd(44),
    height: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.bg7,
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
});
