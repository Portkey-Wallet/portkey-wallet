import React, { useState, useCallback, useEffect, useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { FlatList, StyleSheet } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import CommonInput from 'components/CommonInput';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import useDebounce from 'hooks/useDebounce';
import NoData from 'components/NoData';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchCryptoBoxAssetList } from '@portkey-wallet/store/store-ca/assets/api';
import { IAssetItemType } from '@portkey-wallet/store/store-ca/assets/type';
import { ChainId } from '@portkey-wallet/types';
import { useGStyles } from 'assets/theme/useGStyles';
import myEvents from 'utils/deviceEvent';
import useEffectOnce from 'hooks/useEffectOnce';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import { useAppDispatch } from 'store/hooks';
import { fetchCryptoBoxAssetAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { useAssets } from '@portkey-wallet/hooks/hooks-ca/assets';
import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import CurrencyItem from 'components/CurrencyItem';
import { IAccountCryptoBoxAssetItem } from '@portkey-wallet/types/types-ca/token';
import { ZERO } from '@portkey-wallet/constants/misc';
import { divDecimals } from '@portkey-wallet/utils/converter';

export type TImTransferInfo = {
  isGroupChat?: boolean;
  channelId?: string;
  toUserId?: string;
  name?: string;
  addresses?: { address: string; chainId: ChainId; chainName?: string }[];
};

export type ShowCryptoBoxAssetListParamsType = {
  currentSymbol: string;
  currentChainId: ChainId;
  accountAssetList?: IAccountCryptoBoxAssetItem[];
  imTransferInfo?: TImTransferInfo;
  toAddress?: string;
  onFinishSelectAssets: (item: ICryptoBoxAssetItemType) => void;
};

const AssetItem = (props: {
  currentSymbol: string;
  currentChainId: ChainId;
  item: ICryptoBoxAssetItemType & {
    label: null;
    balance: string;
    balanceInUsd: string;
    displayChainName: string;
    chainImageUrl: string;
  };
  balance?: string;
  balanceInUsd: string;
  onPress: (item: any) => void;
}) => {
  const { onPress, item, balance, balanceInUsd } = props;
  const { assetType } = item;
  const handleSelect = useCallback(() => {
    onPress?.(item);
    OverlayModal.hide();
  }, [item, onPress]);
  if (assetType === AssetType.ft) {
    return (
      <CurrencyItem
        wrapStyle={styles.tokenItem}
        item={item}
        balance={balance}
        balanceInUsd={balanceInUsd}
        onPress={() => handleSelect()}
      />
    );
  }

  if (assetType === AssetType.nft) {
    return <CurrencyItem wrapStyle={styles.tokenItem} item={item} balance={balance} onPress={() => handleSelect()} />;
  }
  return null;
};

const CryptoAssetsList = ({
  currentSymbol,
  currentChainId,
  accountAssetList,
  onFinishSelectAssets,
}: ShowCryptoBoxAssetListParamsType) => {
  const { t } = useLanguage();
  const caAddressInfos = useCaAddressInfoList();
  const [keyword, setKeyword] = useState('');
  const gStyles = useGStyles();
  const dispatch = useAppDispatch();
  const { accountCryptoBoxAssets } = useAssets();
  const debounceKeyword = useDebounce(keyword, 800);

  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const [listShow, setListShow] = useState<IAssetItemType[]>([]);

  const assetListShow = useMemo(() => {
    if (debounceKeyword) {
      return listShow;
    } else {
      return accountCryptoBoxAssets?.accountAssetsList.filter(item => currentChainId === item?.chainId) || [];
    }
  }, [accountCryptoBoxAssets?.accountAssetsList, currentChainId, debounceKeyword, listShow]);
  const filterList = useCallback(
    (list: IAssetItemType[]) => {
      return list.filter(item => currentChainId === item?.chainId);
    },
    [currentChainId],
  );

  const getList = useCallback(
    async (_keyword = '', isInit = false) => {
      if (!isInit && listShow.length > 0) {
        return;
      }
      try {
        const response = await fetchCryptoBoxAssetList({
          caAddressInfos,
          maxResultCount: 1000,
          skipCount: 0,
          keyword: _keyword,
        });
        if (isInit) {
          setListShow(filterList(response.data));
        } else {
          setListShow(pre => filterList(pre.concat(response.data)));
        }
      } catch (err) {
        console.log('fetchCryptoBoxAssetList err:', err);
      }
    },
    [caAddressInfos, filterList, listShow.length],
  );

  const onKeywordChange = useCallback(() => {
    getList(debounceKeyword, true);
  }, [getList, debounceKeyword]);

  useEffect(() => {
    onKeywordChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceKeyword]);

  useEffectOnce(() => {
    getTokenPrice();
    dispatch(fetchCryptoBoxAssetAsync({ keyword: '', caAddressInfos }));
  });
  const [tokenPriceObject] = useGetCurrentAccountTokenPrice();
  const renderItem = useCallback(
    ({ item }: { item: ICryptoBoxAssetItemType }) => {
      console.log(item, 'item');
      const balance =
        accountAssetList?.find(ele => ele.symbol === item.symbol && ele.chainId === item.chainId)?.balance || '0';
      const balanceStr = divDecimals(balance, item.decimals).toFixed();
      const tokenPrice = tokenPriceObject?.[item.symbol];
      const balanceInUsd = `$${ZERO.plus(balanceStr || 0)
        .times(tokenPrice || 0)
        .dp(2)
        .toFixed()}`;
      return (
        <AssetItem
          item={item}
          onPress={() => {
            OverlayModal.hide();
            onFinishSelectAssets?.(item);
          }}
          balance={balanceStr}
          balanceInUsd={balanceInUsd}
          currentSymbol={currentSymbol}
          currentChainId={currentChainId}
        />
      );
    },
    [accountAssetList, currentChainId, currentSymbol, onFinishSelectAssets, tokenPriceObject],
  );

  const noData = useMemo(() => {
    return debounceKeyword ? (
      <NoData noPic message={t('No results found')} />
    ) : (
      <NoData noPic message={t('There are currently no assets to send.')} />
    );
  }, [debounceKeyword, t]);

  return (
    <ModalBody modalBodyType="bottom" title={t('You pay')} style={[gStyles.overlayStyle, { minHeight: pTd(700) }]}>
      <CommonInput
        placeholder={t('Search')}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        value={keyword}
        onChangeText={v => {
          setKeyword(v.trim());
        }}
      />

      <FlatList
        disableScrollViewPanResponder={true}
        onLayout={e => {
          myEvents.nestScrollViewLayout.emit(e.nativeEvent.layout);
        }}
        onScroll={({ nativeEvent }) => {
          const {
            contentOffset: { y: scrollY },
          } = nativeEvent;
          if (scrollY <= 0) {
            myEvents.nestScrollViewScrolledTop.emit();
          }
        }}
        style={styles.flatList}
        data={(assetListShow as ICryptoBoxAssetItemType[]) || []}
        renderItem={renderItem}
        keyExtractor={(_item, index) => `${_item.symbol}${index}`}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListEmptyComponent={noData}
        onEndReached={() => {
          getList();
        }}
      />
    </ModalBody>
  );
};

export const showCryptoAssetList = (params: ShowCryptoBoxAssetListParamsType) => {
  OverlayModal.show(<CryptoAssetsList {...params} />, {
    position: 'bottom',
    autoKeyboardInsets: false,
    enabledNestScrollView: true,
  });
};

export default {
  showCryptoAssetList,
};

export const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    height: pTd(22),
    lineHeight: pTd(22),
    marginTop: pTd(17),
    marginBottom: pTd(16),
    fontSize: pTd(20),
  },
  containerStyle: {
    marginLeft: pTd(16),
    width: pTd(343),
    marginBottom: pTd(8),
  },
  inputContainerStyle: {
    height: pTd(44),
  },
  inputStyle: {
    height: pTd(44),
  },
  flatList: {
    marginTop: pTd(8),
  },
  tokenItem: {
    paddingLeft: 0,
  },
});
