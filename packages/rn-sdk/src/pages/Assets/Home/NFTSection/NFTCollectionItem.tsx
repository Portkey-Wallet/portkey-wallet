import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Collapsible from 'components/Collapsible';
import NFTAvatar from 'components/NFTAvatar';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import CommonSvg from 'components/Svg';
import { TextL, TextM, TextS, TextXL } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { NFTCollectionItemShowType } from 'packages/types/types-ca/assets';
import Touchable from 'components/Touchable';
import { OpenCollectionObjType } from './index';
import { ChainId } from 'packages/types';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { useCurrentNetworkType } from 'model/hooks/network';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';

export enum NoDataMessage {
  CustomNetWorkNoData = 'No transaction records accessible from the current custom network',
  CommonNoData = 'You have no transactions',
}

export type NFTItemPropsType = NFTCollectionItemShowType & {
  collapsed?: boolean;
  openCollectionObj: OpenCollectionObjType;
  setOpenCollectionObj: any;
  openItem: (symbol: string, chainId: ChainId, itemCount: number) => void;
  closeItem: (symbol: string, chainId: ChainId) => void;
  loadMoreItem: (symbol: string, chainId: ChainId, pageNum: number) => void;
};

export default function NFTItem(props: NFTItemPropsType) {
  const {
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

  const currentNetwork = useCurrentNetworkType();
  const { navigateTo } = useBaseContainer({});

  const [open, setOpen] = useState<boolean>(false);

  const openCollectionInfo = useMemo(
    () => openCollectionObj?.[`${symbol}${chainId}`],
    [chainId, openCollectionObj, symbol],
  );

  useEffect(() => {
    setOpen(!!children?.length && !collapsed);
  }, [children, collapsed, openCollectionInfo]);

  const showChildren = children;

  const hasMore = useMemo(
    () => showChildren?.length !== 0 && showChildren?.length < itemCount,
    [itemCount, showChildren?.length],
  );

  const onNavigateToNFTDetail = useCallback(
    (item: any) => {
      navigateTo(PortkeyEntries.NFT_DETAIL_ENTRY, {
        params: {
          nftItem: item,
        },
      });
    },
    [navigateTo],
  );

  return (
    <View style={styles.wrap}>
      <Touchable
        onPressWithSecond={500}
        style={[styles.topSeries]}
        onPress={() => {
          if (openCollectionObj?.[`${symbol}${chainId}`]) {
            closeItem(symbol, chainId);
          } else {
            openItem(symbol, chainId, itemCount);
          }
        }}>
        <CommonSvg
          icon={!open ? 'right-arrow' : 'down-arrow'}
          size={pTd(16)}
          color={defaultColors.font3}
          iconStyle={styles.touchIcon}
        />
        <CommonAvatar imageUrl={imageUrl} title={collectionName} shapeType={'square'} style={styles.avatarStyle} />
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
          {(showChildren || []).map((ele: any, index: number) => (
            <NFTAvatar
              style={[
                styles.itemAvatarStyle,
                index < 3 ? styles.marginTop0 : {},
                index % 3 === 2 ? styles.marginRight0 : {},
              ]}
              key={ele.symbol}
              data={ele}
              onPress={() => {
                onNavigateToNFTDetail({ ...ele, collectionInfo: { imageUrl, collectionName } });
              }}
            />
          ))}
        </View>
        {hasMore && (
          <Touchable
            style={[styles.loadMore]}
            onPress={() => loadMoreItem?.(symbol, chainId, openCollectionInfo?.pageNum + 1)}>
            <TextM style={FontStyles.font4}>More</TextM>
            <CommonSvg
              icon="down-arrow"
              size={pTd(16)}
              color={defaultColors.primaryColor}
              iconStyle={styles.downArrow}
            />
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
  avatarStyle: {
    width: pTd(36),
    height: pTd(36),
    lineHeight: pTd(36),
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
  },
  itemAvatarStyle: {
    marginRight: pTd(8) - StyleSheet.hairlineWidth,
    marginTop: pTd(8),
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
