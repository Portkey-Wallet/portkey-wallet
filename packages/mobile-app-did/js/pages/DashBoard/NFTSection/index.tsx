import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import NoData from 'components/NoData';
import { StyleSheet, View, FlatList } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import NFTCollectionItem from './NFTCollectionItem';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { NFTCollectionItemShowType } from '@portkey-wallet/types/types-ca/assets';
import Touchable from 'components/Touchable';
import { ChainId } from '@portkey-wallet/types';
import { useRoute } from '@react-navigation/native';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useAccountNFTCollectionInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION, REFRESH_TIME } from '@portkey-wallet/constants/constants-ca/assets';
import NFTHint from 'pages/FreeMint/components/NFTHint';
import { useGetRecentStatus, useRecentStatus } from '@portkey-wallet/hooks/hooks-ca/freeMint';
import MintStatusLine from 'pages/FreeMint/components/MintStatusLine';
import { FreeMintStatus } from '@portkey-wallet/types/types-ca/freeMint';
import myEvents from 'utils/deviceEvent';

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

function areEqual(prevProps: NFTCollectionProps, nextProps: NFTCollectionProps) {
  const prevNftObj = prevProps?.openCollectionObj?.[`${prevProps.symbol}${prevProps?.chainId}`];
  const nextNftObj = nextProps?.openCollectionObj?.[`${nextProps.symbol}${nextProps?.chainId}`];

  return (
    nextProps.isCollapsed === prevProps.isCollapsed &&
    prevNftObj?.pageNum === nextNftObj?.pageNum &&
    nextProps.isFetching === prevProps.isFetching &&
    nextProps.itemCount === prevProps.itemCount
  );
}

const NFTCollection: React.FC<NFTCollectionProps> = memo(function NFTCollection(props: NFTCollectionProps) {
  const { symbol, isCollapsed } = props;

  return <NFTCollectionItem key={symbol} collapsed={isCollapsed} {...props} />;
}, areEqual);

export default function NFTSection() {
  const { t } = useLanguage();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { recentStatus, itemId, setRecentStatus, setItemId } = useRecentStatus();
  const getRecentStatus = useGetRecentStatus();
  const caAddressInfos = useCaAddressInfoList();
  const { fetchAccountNFTCollectionInfoList, fetchAccountNFTItem, accountNFTList, totalRecordCount } =
    useAccountNFTCollectionInfo();

  const [reFreshing] = useState(false);
  const [openCollectionObj, setOpenCollectionObj] = useState<OpenCollectionObjType>({});
  const { clearType } = useRoute<any>();

  const getNFTCollectionsAsync = useLockCallback(
    async (isInit: boolean) => {
      if (totalRecordCount && accountNFTList.length >= totalRecordCount && !isInit) return;

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
      getNFTCollectionsAsync(true);
    });
    return () => listener.remove();
  }, [getNFTCollectionsAsync, getRecentStatus, setItemId, setRecentStatus]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(async () => {
      const res = await getRecentStatus();
      setRecentStatus(res.status);
      setItemId(res.itemId);
      setOpenCollectionObj({});
      getNFTCollectionsAsync(true);
    }, REFRESH_TIME);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [setRecentStatus, setItemId, timerRef, getRecentStatus, getNFTCollectionsAsync]);

  useEffect(() => {
    getNFTCollectionsAsync(true);
  }, [getNFTCollectionsAsync]);

  useEffect(() => {
    if (clearType) setOpenCollectionObj({});
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
    <View style={styles.wrap}>
      <FlatList
        nestedScrollEnabled
        refreshing={reFreshing}
        contentContainerStyle={styles.contentContainerStyle}
        data={totalRecordCount === 0 ? [] : accountNFTList || []}
        ListEmptyComponent={() => (
          <View>
            <Touchable>
              <NoData
                icon={'no-data-nft'}
                message={t('No NFTs yet ')}
                topDistance={pTd(40)}
                oblongSize={[pTd(64), pTd(64)]}
              />
            </Touchable>
            {/* <NFTHint /> */}
          </View>
        )}
        renderItem={({ item }: { item: NFTCollectionItemShowType }) => (
          <NFTCollection
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
        // onRefresh={() => {
        //   setOpenCollectionObj({});
        //   getNFTCollectionsAsync(true);
        // }}
        onEndReached={() => getNFTCollectionsAsync()}
        ListFooterComponent={() => (
          <View
            style={{ marginTop: (totalRecordCount === 0 ? [] : accountNFTList || []).length < 1 ? pTd(40) : pTd(24) }}>
            {(totalRecordCount === 0 ? [] : accountNFTList || []).length < 1 && recentStatus === FreeMintStatus.NONE ? (
              <NFTHint recentStatus={recentStatus} itemId={itemId || ''} />
            ) : (
              <MintStatusLine recentStatus={recentStatus} itemId={itemId || ''} />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
  },
  itemWrap: {
    width: '100%',
    height: pTd(100),
  },
  contentContainerStyle: {
    paddingBottom: pTd(16),
  },
});
