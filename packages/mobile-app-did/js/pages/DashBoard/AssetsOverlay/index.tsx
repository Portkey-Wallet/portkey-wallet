import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { useCaAddresses } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchAssetList } from '@portkey-wallet/store/store-ca/assets/api';
import { IAssetItemType } from '@portkey-wallet/store/store-ca/assets/type';
import navigationService from 'utils/navigationService';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { addressFormat, formatChainInfoToShow } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { useGStyles } from 'assets/theme/useGStyles';
import myEvents from 'utils/deviceEvent';
import useEffectOnce from 'hooks/useEffectOnce';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import CommonAvatar from 'components/CommonAvatar';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import { useAppDispatch } from 'store/hooks';
import { fetchAssetAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { useAssets } from '@portkey-wallet/hooks/hooks-ca/assets';

export type ImTransferInfoType = {
  isGroupChat?: boolean;
  channelId?: string;
  toUserId?: string;
  name?: string;
  addresses?: { address: string; chainId: ChainId; chainName?: string }[];
};

export type ShowAssetListParamsType = {
  imTransferInfo?: ImTransferInfoType;
  toAddress?: string;
};

const AssetItem = (props: { symbol: string; onPress: (item: any) => void; item: IAssetItemType }) => {
  const { onPress, item } = props;

  const { currentNetwork } = useWallet();

  if (item.tokenInfo)
    return (
      <TokenListItem
        item={{ name: '', ...item, ...item?.tokenInfo, tokenContractAddress: item.address }}
        onPress={() => onPress(item)}
      />
    );

  if (item.nftInfo) {
    const {
      nftInfo: { tokenId },
    } = item;
    return (
      <TouchableOpacity style={itemStyle.wrap} onPress={() => onPress?.(item)}>
        {item.nftInfo.imageUrl ? (
          <CommonAvatar avatarSize={pTd(48)} style={[itemStyle.left]} imageUrl={item?.nftInfo?.imageUrl} />
        ) : (
          <Text style={[itemStyle.left, itemStyle.noPic]}>{item.symbol[0]}</Text>
        )}
        <View style={itemStyle.right}>
          <View>
            <TextL numberOfLines={1} ellipsizeMode={'tail'} style={[FontStyles.font5]}>
              {`${item?.nftInfo?.alias} #${tokenId}`}
            </TextL>

            <TextS numberOfLines={1} style={[FontStyles.font3, itemStyle.nftItemInfo]}>
              {formatChainInfoToShow(item.chainId as ChainId, currentNetwork)}
            </TextS>
          </View>

          <View style={itemStyle.balanceWrap}>
            <TextL style={[itemStyle.token, FontStyles.font5]}>{item?.nftInfo?.balance}</TextL>
            <TextS style={itemStyle.dollar} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return null;
};
const MAX_RESULT_COUNT = 10;
const INIT_PAGE_INFO = {
  curPage: 0,
  total: 0,
  isLoading: false,
};

const AssetList = ({ imTransferInfo, toAddress = '' }: ShowAssetListParamsType) => {
  const { addresses = [], isGroupChat, toUserId } = imTransferInfo || {};

  const { t } = useLanguage();
  const caAddresses = useCaAddresses();
  const caAddressInfos = useCaAddressInfoList();
  const [keyword, setKeyword] = useState('');
  const gStyles = useGStyles();
  const dispatch = useAppDispatch();
  const { accountAllAssets } = useAssets();

  const chainIds = useMemo(() => addresses?.map(item => item.chainId), [addresses]);

  const debounceKeyword = useDebounce(keyword, 800);

  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const [listShow, setListShow] = useState<IAssetItemType[]>([]);

  const assetListShow = useMemo(() => {
    if (debounceKeyword) {
      return listShow;
    } else {
      return accountAllAssets.accountAssetsList;
    }
  }, [accountAllAssets.accountAssetsList, debounceKeyword, listShow]);

  const pageInfoRef = useRef({
    ...INIT_PAGE_INFO,
  });

  const filterList = useCallback(
    (list: IAssetItemType[]) => {
      if (!chainIds || chainIds?.length === 0) return list;
      return list.filter(item => chainIds?.includes(item?.chainId as ChainId));
    },
    [chainIds],
  );

  const getList = useCallback(
    async (_keyword = '', isInit = false) => {
      if (!isInit && listShow.length > 0 && listShow.length >= pageInfoRef.current.total) return;
      if (pageInfoRef.current.isLoading) return;
      pageInfoRef.current.isLoading = true;
      try {
        const response = await fetchAssetList({
          caAddressInfos,
          caAddresses,
          maxResultCount: MAX_RESULT_COUNT,
          skipCount: pageInfoRef.current.curPage * MAX_RESULT_COUNT,
          keyword: _keyword,
        });

        pageInfoRef.current.curPage = pageInfoRef.current.curPage + 1;
        pageInfoRef.current.total = response.totalRecordCount;
        console.log('fetchAccountAssetsByKeywords:', response);

        if (isInit) {
          setListShow(filterList(response.data));
        } else {
          setListShow(pre => filterList(pre.concat(response.data)));
        }
      } catch (err) {
        console.log('fetchAccountAssetsByKeywords err:', err);
      }
      pageInfoRef.current.isLoading = false;
    },
    [caAddressInfos, caAddresses, filterList, listShow.length],
  );

  const onKeywordChange = useCallback(() => {
    pageInfoRef.current = {
      ...INIT_PAGE_INFO,
    };
    getList(debounceKeyword, true);
  }, [getList, debounceKeyword]);

  useEffect(() => {
    onKeywordChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceKeyword]);

  useEffectOnce(() => {
    getTokenPrice();
    dispatch(fetchAssetAsync({ caAddresses, keyword: '', caAddressInfos }));
  });

  const renderItem = useCallback(
    ({ item }: { item: IAssetItemType }) => {
      const addressItem = addresses?.find(ele => ele?.chainId === item.chainId);

      return (
        <AssetItem
          symbol={item.symbol || ''}
          // icon={'aelf-avatar'}
          item={item}
          onPress={() => {
            OverlayModal.hide();
            const routeParams = {
              sendType: item?.nftInfo ? 'nft' : 'token',
              assetInfo: item?.nftInfo
                ? { ...item?.nftInfo, chainId: item.chainId, symbol: item.symbol }
                : { ...item?.tokenInfo, chainId: item.chainId, symbol: item.symbol },
              toInfo: {
                address: addressItem ? addressFormat(addressItem.address, addressItem.chainId) : toAddress,
                name: imTransferInfo?.name || '',
              },
            };

            if (imTransferInfo?.channelId) {
              navigationService.navigateByMultiLevelParams('SendHome', {
                params: routeParams as unknown as IToSendHomeParamsType,
                multiLevelParams: {
                  imTransferInfo: {
                    isGroupChat,
                    channelId: imTransferInfo?.channelId,
                    toUserId,
                  },
                },
              });
            } else {
              navigationService.navigate('SendHome', routeParams as unknown as IToSendHomeParamsType);
            }
          }}
        />
      );
    },
    [addresses, imTransferInfo?.channelId, imTransferInfo?.name, isGroupChat, toAddress, toUserId],
  );

  const noData = useMemo(() => {
    return debounceKeyword ? (
      <NoData noPic message={t('No results found')} />
    ) : (
      <NoData noPic message={t('There are currently no assets to send.')} />
    );
  }, [debounceKeyword, t]);
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
        data={(assetListShow as IAssetItemType[]) || []}
        renderItem={renderItem}
        keyExtractor={(_item, index) => `${index}`}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListEmptyComponent={noData}
        onEndReached={() => {
          getList();
        }}
      />
    </ModalBody>
  );
};

export const showAssetList = (params?: ShowAssetListParamsType) => {
  OverlayModal.show(<AssetList {...params} />, {
    position: 'bottom',
    autoKeyboardInsets: false,
    enabledNestScrollView: true,
  });
};

export default {
  showAssetList,
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
});
