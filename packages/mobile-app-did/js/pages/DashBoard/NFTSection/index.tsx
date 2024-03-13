import React, { useState, useCallback, memo, useEffect } from 'react';
import NoData from 'components/NoData';
import { StyleSheet, View, FlatList } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import NFTCollectionItem from './NFTCollectionItem';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchNFTAsync, fetchNFTCollectionsAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useAppCASelector } from '@portkey-wallet/hooks';
import { NFTCollectionItemShowType } from '@portkey-wallet/types/types-ca/assets';
import Touchable from 'components/Touchable';
import { ChainId } from '@portkey-wallet/types';
import { useRoute } from '@react-navigation/native';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';

export interface OpenCollectionObjType {
  // key = symbol+chainId
  [key: string]: {
    pageNum: number;
    pageSize: number;
    itemCount: number;
  };
}

type NFTCollectionProps = NFTCollectionItemShowType & {
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

  return nextProps.isCollapsed === prevProps.isCollapsed && prevNftObj?.pageNum === nextNftObj?.pageNum;
}

const NFTCollection: React.FC<NFTCollectionProps> = memo(function NFTCollection(props: NFTCollectionProps) {
  const { symbol, isCollapsed } = props;

  return <NFTCollectionItem key={symbol} collapsed={isCollapsed} {...props} />;
}, areEqual);

export default function NFTSection() {
  const { t } = useLanguage();
  const caAddressInfos = useCaAddressInfoList();
  const dispatch = useAppCommonDispatch();

  const {
    accountNFT: { accountNFTList, totalRecordCount },
  } = useAppCASelector(state => state.assets);

  const [reFreshing] = useState(false);
  const [openCollectionObj, setOpenCollectionObj] = useState<OpenCollectionObjType>({});
  const { clearType } = useRoute<any>();

  const fetchNFTList = useCallback(() => {
    if (caAddressInfos.length === 0) return;
    dispatch(fetchNFTCollectionsAsync({ caAddressInfos }));
  }, [caAddressInfos, dispatch]);

  useEffect(() => {
    fetchNFTList();
  }, [fetchNFTList]);

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

      await dispatch(
        fetchNFTAsync({
          symbol,
          chainId,
          caAddressInfos: caAddressInfos.filter(item => item.chainId === chainId),
          pageNum: 0,
        }),
      );

      setOpenCollectionObj(pre => ({
        ...pre,
        [key]: {
          pageNum: 0,
          pageSize: 9,
          itemCount,
        },
      }));
    },
    [caAddressInfos, dispatch],
  );

  const loadMoreItem = useCallback(
    async (symbol: string, chainId: ChainId, pageNum = 0) => {
      const key = `${symbol}${chainId}`;
      const currentOpenObj = openCollectionObj?.[key];
      const currentCollectionObj = accountNFTList.find(item => item.symbol === symbol && item.chainId === chainId);
      console.log('=====', pageNum, currentOpenObj, currentCollectionObj);

      await dispatch(
        fetchNFTAsync({
          symbol,
          chainId,
          caAddressInfos: caAddressInfos.filter(item => item.chainId === chainId),
          pageNum: pageNum,
        }),
      );

      setOpenCollectionObj(prev => ({
        ...prev,
        [key]: {
          ...currentOpenObj,
          pageNum,
        },
      }));
    },
    [accountNFTList, caAddressInfos, dispatch, openCollectionObj],
  );

  return (
    <View style={styles.wrap}>
      <FlatList
        refreshing={reFreshing}
        data={totalRecordCount === 0 ? [] : accountNFTList || []}
        ListEmptyComponent={() => (
          <Touchable>
            <NoData type="top" message={t('No NFTs yet ')} />
          </Touchable>
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
        onRefresh={() => {
          setOpenCollectionObj({});
          fetchNFTList();
        }}
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
});
