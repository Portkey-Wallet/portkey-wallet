import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, FlatList, Image, Animated } from 'react-native';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import { TextM, TextXXL } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import { pTd } from 'utils/unit';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useAccountNFTCollectionInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { Skeleton } from '@rneui/base';
import { PortkeyLinearGradientV2 } from 'components/PortkeyLinearGradient';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import { NFTItemBaseType } from '@portkey-wallet/types/types-ca/assets';
import { divDecimalsToShow } from '@portkey-wallet/utils/converter';

export interface ICollectionDetailProps {
  name: string;
}

const CollectionDetail = () => {
  const styles = getStyles();
  const [scrollY] = useState(new Animated.Value(0));
  const { imageUrl, collectionName, itemCount, symbol, chainId } = useRouterParams<{
    imageUrl: string;
    collectionName: string;
    itemCount: number;
    symbol: string;
    chainId: ChainId;
  }>();
  const [isInit, setIsInit] = useState<boolean>(true);
  const pageNumRef = useRef<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const caAddressInfos = useCaAddressInfoList();
  const { fetchAccountNFTItem, accountNFTList } = useAccountNFTCollectionInfo();
  const currentCollectionObj = useMemo(() => {
    const currentCollection = accountNFTList.find(item => item.symbol === symbol && item.chainId === chainId);
    if ((currentCollection?.children?.length || 0) === 0) {
      setIsInit(true);
    } else {
      setIsInit(false);
      pageNumRef.current = (currentCollection?.children?.length || 0) % 12;
    }
    return currentCollection;
  }, [accountNFTList, chainId, symbol]);
  useEffect(() => {
    (async () => {
      if (currentCollectionObj?.children?.length === 0) {
        setIsFetching(true);
        await fetchAccountNFTItem({
          symbol,
          chainId,
          caAddressInfos: caAddressInfos.filter(item => item.chainId === chainId),
          pageNum: 0,
        });
        setIsFetching(false);
        pageNumRef.current += 1;
      }
    })();
  }, [caAddressInfos, chainId, currentCollectionObj?.children?.length, fetchAccountNFTItem, symbol]);
  const showChildren = useMemo(() => currentCollectionObj?.children, [currentCollectionObj?.children]);

  const loadMoreItem = useCallback(async () => {
    console.log('loadMoreItem invoke');
    if (itemCount <= (showChildren?.length || 0)) {
      return;
    }
    setIsFetching(true);
    await fetchAccountNFTItem({
      symbol,
      chainId,
      caAddressInfos: caAddressInfos.filter(item => item.chainId === chainId),
      pageNum: pageNumRef.current,
    });
    setIsFetching(false);
    pageNumRef.current += 1;
  }, [caAddressInfos, chainId, fetchAccountNFTItem, itemCount, showChildren?.length, symbol]);
  const skeletonList: number[] = useMemo(() => {
    if (!isFetching && !isInit) {
      return [];
    }
    const count = isInit ? 15 : isFetching ? 3 : 0;
    return count > 0 ? new Array(count).fill('-') : [];
  }, [isFetching, isInit]);

  const renderSkeletonItem = useCallback(
    (item: number) => {
      return (
        <Skeleton
          key={item}
          animation="wave"
          // eslint-disable-next-line react/no-unstable-nested-components
          LinearGradientComponent={() => <PortkeyLinearGradientV2 />}
          style={styles.skeleton}
          height={pTd(110)}
          width={pTd(110)}
        />
      );
    },
    [styles.skeleton],
  );

  const renderItem = useCallback(
    (item: NFTItemBaseType, index: number) => {
      const { alias, balance, decimals, imageUrl: imageUrlLocal } = item;
      const isEndColum = index % 3 === 2;
      return (
        <Touchable
          onPress={() => {
            navigationService.navigate('NFTDetail', {
              ...item,
              collectionInfo: { imageUrl, collectionName, itemCount, symbol, chainId },
            });
          }}>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <View style={[styles.itemContainer, { marginRight: isEndColum ? 0 : pTd(16) }]}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUrlLocal }} style={styles.image} />
              <View style={styles.overlay}>
                <View style={styles.overlayInner} />
              </View>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemName}>{alias}</Text>
              <Text style={styles.itemAmount}>{divDecimalsToShow(balance, decimals)}</Text>
            </View>
          </View>
        </Touchable>
      );
    },
    [
      chainId,
      collectionName,
      imageUrl,
      itemCount,
      styles.image,
      styles.imageContainer,
      styles.itemAmount,
      styles.itemContainer,
      styles.itemName,
      styles.overlay,
      styles.overlayInner,
      styles.textContainer,
      symbol,
    ],
  );
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 95], // Adjust the range as needed
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <PageContainer
      noCenterDom={false}
      titleDom={<Animated.Text style={[styles.title, { opacity: titleOpacity }]}>{collectionName}</Animated.Text>}
      scrollViewProps={{
        disabled: true,
      }}
      hideTouchable>
      {isInit ? (
        <FlatList
          // eslint-disable-next-line react/no-unstable-nested-components
          ListHeaderComponent={() => {
            return (
              <View style={styles.topWrapper}>
                <CommonAvatar avatarSize={pTd(48)} imageUrl={imageUrl} shapeType={'square'} />
                <TextXXL style={styles.collectionName}>{collectionName}</TextXXL>
                <TextM style={styles.collectionCount}>{itemCount || currentCollectionObj?.itemCount} items</TextM>
              </View>
            );
          }}
          ListHeaderComponentStyle={styles.headerStyle}
          data={skeletonList}
          renderItem={({ item }) => renderSkeletonItem(item)}
          keyExtractor={(_item, index) => index.toString()}
          numColumns={3}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapperThree}
          // eslint-disable-next-line react/no-unstable-nested-components
          ItemSeparatorComponent={() => <View style={GStyles.height(16)} />}
        />
      ) : (
        <FlatList
          // eslint-disable-next-line react/no-unstable-nested-components
          ListHeaderComponent={() => {
            return (
              <View style={styles.topWrapper}>
                <CommonAvatar avatarSize={pTd(48)} imageUrl={imageUrl} shapeType={'square'} />
                <TextXXL style={styles.collectionName}>{collectionName}</TextXXL>
                <TextM style={styles.collectionCount}>
                  {itemCount || currentCollectionObj?.totalRecordCount} items
                </TextM>
              </View>
            );
          }}
          ListHeaderComponentStyle={styles.headerStyle}
          data={showChildren}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={item => item.tokenId}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
          // eslint-disable-next-line react/no-unstable-nested-components
          ItemSeparatorComponent={() => <View style={GStyles.height(16)} />}
          columnWrapperStyle={styles.columnWrapper}
          // eslint-disable-next-line react/no-unstable-nested-components
          ListFooterComponent={() => {
            return isFetching && !isInit ? (
              <View style={[GStyles.flexRow, styles.columnMode]}>
                {skeletonList.map((_ele, i) => {
                  return (
                    <Skeleton
                      key={i}
                      animation="wave"
                      // eslint-disable-next-line react/no-unstable-nested-components
                      LinearGradientComponent={() => <PortkeyLinearGradientV2 />}
                      style={styles.skeleton}
                      height={pTd(110)}
                      width={pTd(110)}
                    />
                  );
                })}
              </View>
            ) : null;
          }}
          onEndReached={loadMoreItem}
        />
      )}
    </PageContainer>
  );
};

export default CollectionDetail;

const getStyles = makeStyles(theme => ({
  title: {
    fontSize: pTd(16),
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
  },
  headerStyle: {
    marginBottom: pTd(24),
  },
  topWrapper: {
    width: '100%',
    marginTop: pTd(16),
    flexDirection: 'column',
    alignItems: 'center',
  },
  collectionName: {
    ...fonts.BGMediumFont,
    marginTop: pTd(16),
  },
  collectionCount: {
    marginTop: pTd(4),
    ...fonts.SGRegularFont,
    opacity: 0.7,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  columnWrapperThree: {
    justifyContent: 'space-between',
  },
  columnMode: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: pTd(110),
    display: 'flex',
  },
  imageContainer: {
    alignSelf: 'stretch',
    height: pTd(110),
    width: pTd(110),
    backgroundColor: '#E3E3E3',
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    display: 'flex',
  },
  image: {
    width: pTd(110),
    height: pTd(110),
  },
  overlay: {
    alignSelf: 'stretch',
    height: 54.83,
    transform: [{ rotate: '36.87deg' }],
    transformOrigin: '0 0',
    opacity: 0,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    display: 'flex',
  },
  overlayInner: {
    alignSelf: 'stretch',
    height: 0,
    transform: [{ rotate: '-30deg' }],
    transformOrigin: '0 0',
    backgroundColor: 'white',
  },
  textContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  itemName: {
    alignSelf: 'stretch',
    color: theme.colors.textBase1,
    fontSize: pTd(14),
    ...fonts.SGRegularFont,
    fontWeight: '400',
    lineHeight: 14,
    wordWrap: 'break-word',
    marginTop: pTd(8),
  },
  itemAmount: {
    alignSelf: 'stretch',
    color: theme.colors.textBase1,
    opacity: 0.4,
    fontSize: pTd(12),
    ...fonts.SGRegularFont,
    fontWeight: '400',
    lineHeight: 12,
    marginTop: pTd(4),
  },
  skeleton: {
    borderRadius: pTd(8),
    backgroundColor: theme.colors.bgBase3,
    opacity: 0.3,
  },
}));
