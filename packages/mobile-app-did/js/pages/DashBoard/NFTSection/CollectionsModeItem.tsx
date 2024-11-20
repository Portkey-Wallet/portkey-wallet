import React from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL } from 'components/CommonText';
import { NFTCollectionItemShowType } from '@portkey-wallet/types/types-ca/assets';
import Touchable from 'components/Touchable';
import { OpenCollectionObjType } from './index';
import { ChainId } from '@portkey-wallet/types';
import { makeStyles } from '@rneui/themed';
import { isIOS } from '@rneui/base';

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

export default function CollectionItem(props: NFTItemPropsType) {
  const { chainId, collectionName, imageUrl, itemCount, symbol, chainImageUrl, displayChainImage } = props;
  const styles = getStyles();

  // const openCollectionInfo = useMemo(
  //   () => openCollectionObj?.[`${symbol}${chainId}`],
  //   [chainId, openCollectionObj, symbol],
  // );

  // const showChildren = useMemo(
  //   () => (children.length > 9 ? children.slice(0, ((openCollectionInfo?.pageNum ?? 0) + 1) * 9) : children),
  //   [children, openCollectionInfo?.pageNum],
  // );

  // const skeletonList = useMemo(() => {
  //   if (!isFetching) return [];

  //   const count = itemCount - showChildren?.length >= 9 ? 9 : itemCount - showChildren?.length;
  //   return count > 0 ? new Array(count).fill('-') : [];
  // }, [isFetching, itemCount, showChildren?.length]);

  return (
    <View style={styles.wrap}>
      <Touchable
        onPressWithSecond={800}
        style={[styles.topSeries]}
        onPress={() => {
          navigationService.navigate('CollectionDetail', {
            imageUrl,
            collectionName,
            itemCount,
            symbol,
            chainId,
          });
        }}>
        <View>
          <CommonAvatar
            avatarSize={pTd(172.5)}
            imageUrl={imageUrl}
            title={collectionName}
            shapeType={'square'}
            style={{
              borderRadius: pTd(8),
            }}
          />
          {displayChainImage && (
            <CommonAvatar
              hasBorder
              style={styles.chainIcon}
              avatarSize={pTd(24)}
              imageUrl={chainImageUrl}
              titleStyle={styles.tokenIconTitle}
              borderStyle={styles.iconBorder}
            />
          )}
        </View>
        <View style={[GStyles.flexRow, styles.collectNameAndCountWrapper]}>
          <TextL style={styles.collectionName} numberOfLines={1} ellipsizeMode="tail">
            {collectionName}
          </TextL>
          <TextL style={styles.itemCount}>{itemCount}</TextL>
        </View>
      </Touchable>
    </View>
  );
}
const getStyles = makeStyles(theme => ({
  wrap: {
    width: isIOS ? pTd(173) : Math.floor(pTd(173)),
    backgroundColor: theme.colors.bgBase2,
  },
  title: {
    color: defaultColors.font16,
    // fontWeight: '400',
  },
  topSeries: {
    ...GStyles.flexCol,
    alignItems: 'flex-start',
    width: '100%',
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
  collectNameAndCountWrapper: {
    width: '100%',
    justifyContent: 'space-between',
    marginTop: pTd(8),
  },
  collectionName: {
    color: theme.colors.textBase1,
  },
  itemCount: {
    color: theme.colors.textBase1,
    opacity: 0.7,
    marginRight: pTd(7),
  },
  iconBorder: {
    borderColor: theme.colors.borderBase1,
  },
  tokenIconTitle: {
    fontSize: pTd(10),
  },
  chainIcon: {
    position: 'absolute',
    right: pTd(4),
    bottom: pTd(4),
  },
}));
