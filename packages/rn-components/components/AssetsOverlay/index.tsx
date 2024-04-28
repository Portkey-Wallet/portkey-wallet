import React, { useState, useCallback, useEffect, useMemo } from 'react';
import OverlayModal from '../OverlayModal';
import { FlatList, StyleSheet, View } from 'react-native';
import { TextL, TextS } from '../CommonText';
import { ModalBody } from '../ModalBody';
import CommonInput from '../CommonInput';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import useDebounce from 'hooks/useDebounce';
import NoData from '../NoData';
import { useCaAddressInfoList, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import TokenListItem from '../TokenListItem';
import { FontStyles } from 'assets/theme/styles';
import { fetchAssetList } from '@portkey-wallet/store/store-ca/assets/api';
import { IAssetItemType } from '@portkey-wallet/store/store-ca/assets/type';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { addressFormat, formatChainInfoToShow } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import myEvents from 'utils/deviceEvent';
import useEffectOnce from 'hooks/useEffectOnce';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import { useAccountAssetsInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import Touchable from '../Touchable';
import NFTAvatar from '../NFTAvatar';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_IN_ACCOUNT_ASSETS } from '@portkey-wallet/constants/constants-ca/assets';
import { makeStyles, useGStyles } from '../../theme';
import { Theme } from '../../theme/type';
import GStyles from '../../theme/GStyles';

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

  const nftAliasAndId = useMemo(
    () => `${item?.nftInfo?.alias} #${item?.nftInfo?.tokenId}`,
    [item?.nftInfo?.alias, item?.nftInfo?.tokenId],
  );
  const itemStyle = useStyles();
  if (item.tokenInfo)
    return (
      <TokenListItem
        item={{ name: '', ...item, ...item?.tokenInfo, tokenContractAddress: item.address }}
        onPress={() => onPress(item)}
      />
    );

  if (item.nftInfo) {
    return (
      <Touchable style={itemStyle.wrap} onPress={() => onPress?.(item)}>
        <NFTAvatar
          disabled
          isSeed={item?.nftInfo?.isSeed}
          seedType={item?.nftInfo?.seedType}
          nftSize={pTd(48)}
          data={item?.nftInfo}
          style={itemStyle.left}
        />

        <View style={itemStyle.right}>
          <View>
            <TextL
              numberOfLines={2}
              ellipsizeMode={'tail'}
              style={[FontStyles.font5, GStyles.maxWidth(pTd(160)), nftAliasAndId?.length > 15 && itemStyle.font14]}>
              {nftAliasAndId}
            </TextL>

            <TextS numberOfLines={1} style={[FontStyles.font3, itemStyle.nftItemInfo]}>
              {formatChainInfoToShow(item.chainId as ChainId, currentNetwork)}
            </TextS>
          </View>

          <View style={itemStyle.balanceWrap}>
            <TextL style={[itemStyle.token, FontStyles.font5]}>
              {formatTokenAmountShowWithDecimals(item?.nftInfo?.balance, item.nftInfo.decimals)}
            </TextL>
            <TextS style={itemStyle.dollar} />
          </View>
        </View>
      </Touchable>
    );
  }
  return null;
};

const AssetList = ({ imTransferInfo, toAddress = '' }: ShowAssetListParamsType) => {
  const { addresses, isGroupChat, toUserId } = imTransferInfo || {};

  const { t } = useLanguage();
  const gStyles = useGStyles();
  const caAddressInfos = useCaAddressInfoList();
  const [keyword, setKeyword] = useState('');
  const { accountAssetsList, fetchAccountAssetsInfoList, totalRecordCount } = useAccountAssetsInfo();

  const debounceKeyword = useDebounce(keyword, 800);

  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const [filteredListShow, setFilteredListShow] = useState<IAssetItemType[]>([]);

  const chainIds = useMemo(() => addresses?.map(item => item.chainId), [addresses]);

  const filterList = useCallback(
    (list: IAssetItemType[]) => {
      if (!chainIds || chainIds?.length === 0) return list;
      return list.filter(item => chainIds?.includes(item?.chainId as ChainId));
    },
    [chainIds],
  );

  const assetListShow = useMemo(() => {
    if (debounceKeyword) {
      return filterList(filteredListShow);
    } else {
      return filterList(accountAssetsList);
    }
  }, [accountAssetsList, debounceKeyword, filterList, filteredListShow]);

  const getAssetsList = useLockCallback(
    async (isInit: boolean) => {
      if (debounceKeyword.trim()) return;

      if (totalRecordCount && accountAssetsList.length >= totalRecordCount && !isInit) return;

      try {
        await fetchAccountAssetsInfoList({
          caAddressInfos,
          skipCount: isInit ? 0 : accountAssetsList.length,
          maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
          keyword: '',
        });
      } catch (error) {
        console.log('fetchAccountAssetsByKeywords err:', error);
      }
    },
    [accountAssetsList.length, caAddressInfos, fetchAccountAssetsInfoList, debounceKeyword, totalRecordCount],
  );

  const getFilteredAssetsList = useLockCallback(async () => {
    if (!debounceKeyword.trim()) return;

    try {
      const response = await fetchAssetList({
        caAddressInfos,
        maxResultCount: PAGE_SIZE_DEFAULT,
        skipCount: 0,
        keyword: debounceKeyword,
      });
      setFilteredListShow(response.data);
    } catch (err) {
      console.log('fetchAccountAssetsByKeywords err:', err);
    }
  }, [caAddressInfos, debounceKeyword]);

  useEffect(() => {
    getFilteredAssetsList();
  }, [getFilteredAssetsList]);

  useEffectOnce(() => {
    getTokenPrice();
    getAssetsList(true);
  });

  const renderItem = useCallback(
    ({ item }: { item: IAssetItemType }) => {
      const addressItem = addresses?.find(ele => ele?.chainId === item.chainId);

      return (
        <AssetItem
          symbol={item.symbol || ''}
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
              console.log('SendHome here1');
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
              console.log('SendHome here2');
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
        data={assetListShow}
        renderItem={renderItem}
        keyExtractor={(_item, index) => `${index}`}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListEmptyComponent={noData}
        onEndReached={() => getAssetsList()}
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

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrap: {
      height: pTd(72),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    left: {
      marginLeft: pTd(16),
      borderRadius: pTd(6),
      overflow: 'hidden',
    },
    noPic: {
      backgroundColor: theme.bg7,
      color: theme.font7,
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
      borderBottomColor: theme.bg7,
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
    font14: {
      fontSize: pTd(14),
    },
  };
});
