import React, { useState, useCallback, memo, useContext } from 'react';
import NoData from 'components/NoData';
import { StyleSheet, View, FlatList } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import NFTCollectionItem from './NFTCollectionItem';
import { NFTCollectionItemShowType } from 'packages/types/types-ca/assets';
import Touchable from 'components/Touchable';
import { ChainId } from 'packages/types';
import useLockCallback from 'packages/hooks/useLockCallback';
import AssetsContext, { AssetsContextType } from 'global/context/assets/AssetsContext';
import Loading from 'components/Loading';

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
  const { symbol, isCollapsed, chainId } = props;

  return <NFTCollectionItem key={`${symbol}${chainId}`} collapsed={isCollapsed} {...props} />;
}, areEqual);

export default function NFTSection() {
  const { t } = useLanguage();
  const [openCollectionObj, setOpenCollectionObj] = useState<OpenCollectionObjType>({});
  const { nftCollections, updateNftCollections } = useContext<AssetsContextType>(AssetsContext);
  const [refreshing] = useState<boolean>(false);

  // useEffect(() => {
  //   updateNftCollections();
  // }, [updateNftCollections]);

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
      Loading.show();
      try {
        await updateNftCollections({
          symbol,
        });
      } catch (ignored) {}
      Loading.hide();
      setOpenCollectionObj(pre => ({
        ...pre,
        [key]: {
          pageNum: 0,
          pageSize: 9,
          itemCount,
        },
      }));
    },
    [openCollectionObj],
  );

  const onRefresh = useCallback(async () => {
    Loading.show();
    try {
      await updateNftCollections();
    } catch (e) {
      console.log(e);
    }
    Loading.hide();
  }, [updateNftCollections]);

  const loadMoreItem = useCallback(
    async (symbol: string, chainId: ChainId, pageNum = 0) => {
      const key = `${symbol}${chainId}`;
      const currentOpenObj = openCollectionObj?.[key];
      // const currentCollectionObj = accountNFTList.find(item => item.symbol === symbol && item.chainId === chainId);
      // console.log('=====', pageNum, currentOpenObj, currentCollectionObj);

      // await dispatch(
      //   fetchNFTAsync({
      //     symbol,
      //     chainId,
      //     caAddressInfos: caAddressInfos.filter(item => item.chainId === chainId),
      //     caAddresses: [currentCaAddress || ''],
      //     pageNum: pageNum,
      //   }),
      // );

      setOpenCollectionObj(prev => ({
        ...prev,
        [key]: {
          ...currentOpenObj,
          pageNum,
        },
      }));
    },
    [openCollectionObj],
  );

  return (
    <View style={styles.wrap}>
      <FlatList
        data={nftCollections ?? []}
        ListEmptyComponent={() => (
          <Touchable>
            <NoData type="top" message={t('No NFTs yet ')} />
          </Touchable>
        )}
        renderItem={({ item }: { item: NFTCollectionItemShowType }) => (
          <NFTCollection
            isCollapsed={!openCollectionObj?.[`${item.symbol}${item.chainId}`]}
            openCollectionObj={openCollectionObj}
            setOpenCollectionObj={setOpenCollectionObj}
            openItem={openItem}
            closeItem={closeItem}
            loadMoreItem={loadMoreItem}
            {...item}
          />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
