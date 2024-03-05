import React, { useState, useCallback, useEffect, useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextL, TextS } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import CommonInput from 'components/CommonInput';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import useDebounce from 'hooks/useDebounce';
import NoData from 'components/NoData';
import { defaultColors } from 'assets/theme';
import { useCaAddressInfoList, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import TokenListItem from 'components/TokenListItem';
import { FontStyles } from 'assets/theme/styles';
import { fetchCryptoBoxAssetList } from '@portkey-wallet/store/store-ca/assets/api';
import { IAssetItemType } from '@portkey-wallet/store/store-ca/assets/type';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { useGStyles } from 'assets/theme/useGStyles';
import myEvents from 'utils/deviceEvent';
import useEffectOnce from 'hooks/useEffectOnce';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import { useAppDispatch } from 'store/hooks';
import { fetchCryptoBoxAssetAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { useAssets } from '@portkey-wallet/hooks/hooks-ca/assets';
import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import NFTAvatar from 'components/NFTAvatar';

export type ImTransferInfoType = {
  isGroupChat?: boolean;
  channelId?: string;
  toUserId?: string;
  name?: string;
  addresses?: { address: string; chainId: ChainId; chainName?: string }[];
};

export type ShowCryptoBoxAssetListParamsType = {
  currentSymbol: string;
  currentChainId: ChainId;
  imTransferInfo?: ImTransferInfoType;
  toAddress?: string;
  onFinishSelectAssets: (item: ICryptoBoxAssetItemType) => void;
};

const AssetItem = (props: {
  currentSymbol: string;
  currentChainId: ChainId;
  item: ICryptoBoxAssetItemType;
  onPress: (item: any) => void;
}) => {
  const { currentNetwork } = useWallet();

  const { currentSymbol, currentChainId, onPress, item } = props;
  const { address, assetType, chainId, symbol, alias, tokenId } = item;

  if (assetType === AssetType.ft)
    return (
      <TokenListItem
        noBalanceShow
        currentSymbol={currentSymbol}
        currentChainId={currentChainId}
        item={{ name: '', ...item, tokenContractAddress: address, decimals: Number(item.decimals || 0) }}
        onPress={() => onPress(item)}
      />
    );

  if (assetType === AssetType.nft) {
    return (
      <TouchableOpacity style={itemStyle.wrap} onPress={() => onPress?.(item)}>
        <NFTAvatar disabled seedType="ft" nftSize={pTd(48)} badgeSizeType="small" data={item} style={itemStyle.left} />
        <View style={itemStyle.right}>
          <View>
            <TextL numberOfLines={1} ellipsizeMode={'tail'} style={[itemStyle.nftNameShow, FontStyles.font5]}>
              {`${alias} #${tokenId}`}
            </TextL>
            <TextS numberOfLines={1} style={[FontStyles.font3, itemStyle.nftItemInfo]}>
              {formatChainInfoToShow(chainId as ChainId, currentNetwork)}
            </TextS>
          </View>
          {currentSymbol === symbol && currentChainId === item?.chainId && (
            <Svg icon="selected" size={pTd(24)} iconStyle={GStyles.flexEnd} />
          )}
        </View>
      </TouchableOpacity>
    );
  }
  return null;
};

const CryptoAssetsList = ({
  currentSymbol,
  currentChainId,
  imTransferInfo,
  onFinishSelectAssets,
}: ShowCryptoBoxAssetListParamsType) => {
  const { addresses = [] } = imTransferInfo || {};

  const { t } = useLanguage();
  const caAddressInfos = useCaAddressInfoList();
  const [keyword, setKeyword] = useState('');
  const gStyles = useGStyles();
  const dispatch = useAppDispatch();
  const { accountCryptoBoxAssets } = useAssets();

  console.log('accountCryptoBoxAssets:', accountCryptoBoxAssets);

  const chainIds = useMemo(() => addresses?.map(item => item.chainId), [addresses]);

  const debounceKeyword = useDebounce(keyword, 800);

  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const [listShow, setListShow] = useState<IAssetItemType[]>([]);

  const assetListShow = useMemo(() => {
    if (debounceKeyword) {
      return listShow;
    } else {
      return accountCryptoBoxAssets?.accountAssetsList || [];
    }
  }, [accountCryptoBoxAssets?.accountAssetsList, debounceKeyword, listShow]);

  const filterList = useCallback(
    (list: IAssetItemType[]) => {
      if (!chainIds || chainIds?.length === 0) return list;
      return list.filter(item => chainIds?.includes(item?.chainId as ChainId));
    },
    [chainIds],
  );

  const getList = useCallback(
    async (_keyword = '', isInit = false) => {
      if (!isInit && listShow.length > 0) return;
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

  const renderItem = useCallback(
    ({ item }: { item: ICryptoBoxAssetItemType }) => {
      return (
        <AssetItem
          item={item}
          onPress={() => {
            OverlayModal.hide();
            onFinishSelectAssets?.(item);
          }}
          currentSymbol={currentSymbol}
          currentChainId={currentChainId}
        />
      );
    },
    [currentChainId, currentSymbol, onFinishSelectAssets],
  );

  const noData = useMemo(() => {
    return debounceKeyword ? (
      <NoData noPic message={t('No results found')} />
    ) : (
      <NoData noPic message={t('There are currently no assets to send.')} />
    );
  }, [debounceKeyword, t]);

  console.log('assetListShow:', assetListShow);

  return (
    <ModalBody modalBodyType="bottom" title={t('Select Assets')} style={gStyles.overlayStyle}>
      {/* no assets in this account  */}
      <CommonInput
        placeholder={t('Search Assets')}
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
});

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(72),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    marginLeft: pTd(16),
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
  noPic: {
    backgroundColor: defaultColors.bg7,
    color: defaultColors.font7,
    fontSize: pTd(20),
    textAlign: 'center',
    lineHeight: pTd(48),
  },
  right: {
    height: pTd(72),
    marginLeft: pTd(16),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: defaultColors.bg7,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tokenName: {
    flex: 1,
  },
  balanceWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  token: {
    lineHeight: pTd(22),
    overflow: 'hidden',
  },
  dollar: {
    marginTop: pTd(2),
    lineHeight: pTd(16),
  },
  nftItemInfo: {
    marginTop: pTd(2),
  },
  nftNameShow: {
    width: pTd(250),
  },
});
