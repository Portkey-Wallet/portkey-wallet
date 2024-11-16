import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, FlatList, Image } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import NFTItem from './NFTsModeItem';
import CollectionItem from './CollectionsModeItem';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { NFTCollectionItemShowType } from '@portkey-wallet/types/types-ca/assets';
import Touchable from 'components/Touchable';
import { ChainId } from '@portkey-wallet/types';
import { useRoute } from '@react-navigation/native';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useAccountNFTCollectionInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION, REFRESH_TIME } from '@portkey-wallet/constants/constants-ca/assets';
import { useGetRecentStatus, useRecentStatus } from '@portkey-wallet/hooks/hooks-ca/freeMint';
import myEvents from 'utils/deviceEvent';
import { useNFTSection } from '@portkey-wallet/hooks/hooks-ca';
import { makeStyles } from '@rneui/themed';
import navigationService from 'utils/navigationService';
import MintStatusLine from 'pages/FreeMint/components/MintStatusLine';
import { FreeMintStatus } from '@portkey-wallet/types/types-ca/freeMint';

export interface OpenCollectionObjType {
  // key = symbol+chainId
  [key: string]: {
    pageNum: number;
    pageSize: number;
    itemCount: number;
  };
}

type NFTCollectionProps = NFTCollectionItemShowType & {
  isFetching?: boolean;
  isCollapsed: boolean;
  openCollectionObj: OpenCollectionObjType;
  setOpenCollectionObj: any;
  openItem: (symbol: string, chainId: ChainId, itemCount: number) => void;
  closeItem: (symbol: string, chainId: ChainId) => void;
  loadMoreItem: (symbol: string, chainId: ChainId, pageNum: number) => void;
};
type NFTSectionItemProps = NFTCollectionProps & {
  mode: 'Collections' | 'NFTs';
};

const NFTSectionItem: React.FC<NFTSectionItemProps> = function NFTSectionItem(props: NFTSectionItemProps) {
  const { symbol, isCollapsed, mode } = props;
  if (mode === 'NFTs') {
    return <NFTItem key={symbol} collapsed={isCollapsed} {...props} />;
  } else {
    return <CollectionItem key={symbol} collapsed={isCollapsed} {...props} />;
  }
};

const ListHeaderComponent = ({
  recentStatus,
  itemId,
  imageUrl,
}: {
  recentStatus: FreeMintStatus;
  itemId: string;
  imageUrl: string;
}) => {
  if (recentStatus === FreeMintStatus.PENDING || recentStatus === FreeMintStatus.FAIL) {
    return (
      <View>
        <MintStatusLine recentStatus={recentStatus} itemId={itemId || ''} imageUrl={imageUrl || ''} />
      </View>
    );
  }
  return null;
};
const ItemSeparatorComponent = () => {
  const styles = getStyles();
  return <View style={styles.separator} />;
};

const ListEmptyComponent = () => {
  const styles = getStyles();
  return (
    <View>
      <Touchable
        onPress={() => {
          navigationService.navigate('FreeMintHome');
        }}>
        <Image source={require('../../../assets/image/pngs/no-nft-banner.png')} style={[styles.imageEmpty]} />
      </Touchable>
    </View>
  );
};
export default function NFTSection() {
  const { t } = useLanguage();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { recentStatus, itemId, imageUrl, setRecentStatus, setItemId, setImageUrl } = useRecentStatus();
  const getRecentStatus = useGetRecentStatus();
  const caAddressInfos = useCaAddressInfoList();
  const { fetchAccountNFTCollectionInfoList, fetchAccountNFTItem, accountNFTList, totalRecordCount } =
    useAccountNFTCollectionInfo();
  const [reFreshing] = useState(false);
  const [openCollectionObj, setOpenCollectionObj] = useState<OpenCollectionObjType>({});
  const { clearType } = useRoute<any>();
  const { nftSectionUiType } = useNFTSection();
  const styles = getStyles();

  const getNFTCollectionsAsync = useLockCallback(
    async (isInit: boolean) => {
      if (totalRecordCount && accountNFTList.length >= totalRecordCount && !isInit) {
        return;
      }

      await fetchAccountNFTCollectionInfoList({
        caAddressInfos,
        skipCount: isInit ? 0 : accountNFTList.length,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
      });
    },
    [accountNFTList.length, caAddressInfos, fetchAccountNFTCollectionInfoList, totalRecordCount],
  );
  useEffect(() => {
    const listener = myEvents.updateMintStatus.addListener(async () => {
      const res = await getRecentStatus();
      setRecentStatus(res.status);
      setItemId(res.itemId);
      setImageUrl(res.imageUrl);
      getNFTCollectionsAsync(true);
    });
    return () => listener.remove();
  }, [getNFTCollectionsAsync, getRecentStatus, setImageUrl, setItemId, setRecentStatus]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(async () => {
      const res = await getRecentStatus();
      setRecentStatus(res.status);
      setItemId(res.itemId);
      setImageUrl(res.imageUrl);
      setOpenCollectionObj({});
      getNFTCollectionsAsync(true);
    }, REFRESH_TIME);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [setRecentStatus, setItemId, timerRef, getRecentStatus, getNFTCollectionsAsync, setImageUrl]);

  useEffect(() => {
    getNFTCollectionsAsync(true);
  }, [getNFTCollectionsAsync]);

  useEffect(() => {
    if (clearType) {
      setOpenCollectionObj({});
    }
  }, [clearType]);

  const closeItem = useCallback((symbol: string, chainId: string) => {
    const key = `${symbol}${chainId}`;

    setOpenCollectionObj(pre => {
      const newObj = { ...pre };
      delete newObj[key];
      return newObj;
    });
  }, []);

  const openItem = useLockCallback(
    async (symbol: string, chainId: ChainId, itemCount: number) => {
      const key = `${symbol}${chainId}`;

      setOpenCollectionObj(pre => ({
        ...pre,
        [key]: {
          pageNum: 0,
          pageSize: 9,
          itemCount,
        },
      }));
      console.log('openItem');
      await fetchAccountNFTItem({
        symbol,
        chainId,
        caAddressInfos: caAddressInfos.filter(item => item.chainId === chainId),
        pageNum: 0,
      });
    },
    [caAddressInfos, fetchAccountNFTItem],
  );

  const loadMoreItem = useCallback(
    async (symbol: string, chainId: ChainId, pageNum = 0) => {
      const key = `${symbol}${chainId}`;
      const currentOpenObj = openCollectionObj?.[key];
      const currentCollectionObj = accountNFTList.find(item => item.symbol === symbol && item.chainId === chainId);
      console.log('=====', pageNum, currentOpenObj, currentCollectionObj);

      fetchAccountNFTItem({
        symbol,
        chainId,
        caAddressInfos: caAddressInfos.filter(item => item.chainId === chainId),
        pageNum: pageNum,
      });

      setOpenCollectionObj(prev => ({
        ...prev,
        [key]: {
          ...currentOpenObj,
          pageNum,
        },
      }));
    },
    [accountNFTList, caAddressInfos, fetchAccountNFTItem, openCollectionObj],
  );
  return (
    <View style={[styles.wrap, nftSectionUiType === 'NFTs' ? { paddingTop: pTd(8) } : {}]}>
      <FlatList
        key={nftSectionUiType}
        nestedScrollEnabled
        refreshing={reFreshing}
        contentContainerStyle={styles.contentContainerStyle}
        data={totalRecordCount === 0 ? [] : accountNFTList || []}
        numColumns={nftSectionUiType === 'Collections' ? 2 : 1}
        columnWrapperStyle={nftSectionUiType === 'Collections' ? styles.columnWrapperStyle : null}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({ item }: { item: NFTCollectionItemShowType }) => (
          <NFTSectionItem
            mode={nftSectionUiType}
            key={`${item.symbol}${item.chainId}`}
            isCollapsed={!openCollectionObj?.[`${item.symbol}${item.chainId}`]}
            openCollectionObj={openCollectionObj}
            setOpenCollectionObj={setOpenCollectionObj}
            openItem={openItem}
            closeItem={closeItem}
            loadMoreItem={loadMoreItem}
            {...item}
          />
        )}
        keyExtractor={(item: NFTCollectionItemShowType) => item?.symbol + item.chainId}
        onEndReached={() => getNFTCollectionsAsync()}
        ListHeaderComponent={
          <ListHeaderComponent recentStatus={recentStatus} itemId={itemId || ''} imageUrl={imageUrl || ''} />
        }
      />
    </View>
  );
}
const getStyles = makeStyles(theme => ({
  wrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase2,
    paddingHorizontal: pTd(16),
  },
  itemWrap: {
    width: '100%',
    height: pTd(100),
  },
  contentContainerStyle: {
    paddingBottom: pTd(16),
  },
  separator: {
    height: pTd(24),
  },
  columnWrapperStyle: { justifyContent: 'space-between' },
  imageEmpty: {
    width: pTd(361),
    height: pTd(152),
  },
}));
