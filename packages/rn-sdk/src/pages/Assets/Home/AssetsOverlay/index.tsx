import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import OverlayModal from '@portkey-wallet/rn-components/components/OverlayModal';
import { ChainId } from '@portkey/provider-types';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from '@portkey-wallet/rn-components/components/CommonAvatar';
import CommonInput from '@portkey-wallet/rn-components/components/CommonInput';
import { TextL, TextS } from '@portkey-wallet/rn-components/components/CommonText';
import { ModalBody } from '@portkey-wallet/rn-components/components/ModalBody';
import NoData from '@portkey-wallet/rn-components/components/NoData';
import TokenListItem from 'components/TokenListItem';
import useDebounce from 'hooks/useDebounce';
import { useLanguage } from 'i18n/hooks';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { TouchableOpacity, Text, View, FlatList, StyleSheet } from 'react-native';
import myEvents from 'utils/deviceEvent';
import { pTd } from 'utils/unit';
import { NetworkController } from 'network/controller';
import { getUnlockedWallet } from 'model/wallet';
import { IAssetItemType } from 'network/dto/query';
import { useCommonNetworkInfo } from 'components/TokenOverlay/hooks';
import { useCurrentNetworkType } from 'model/hooks/network';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import { useGStyles } from 'assets/theme/useGStyles';

const AssetItem = (props: { symbol: string; onPress: (item: any) => void; item: IAssetItemType }) => {
  const { symbol, onPress, item } = props;

  const currentNetwork = useCurrentNetworkType();
  const commonInfo = useCommonNetworkInfo(item.chainId);

  const nftAliasAndId = useMemo(
    () => `${item?.nftInfo?.alias} #${item?.nftInfo?.tokenId}`,
    [item?.nftInfo?.alias, item?.nftInfo?.tokenId],
  );

  if (item.tokenInfo)
    return (
      <TokenListItem
        commonInfo={commonInfo}
        item={{ ...item, ...item?.tokenInfo, tokenContractAddress: item.address }}
        onPress={() => onPress(item)}
      />
    );

  if (item.nftInfo) {
    return (
      <TouchableOpacity style={itemStyle.wrap} onPress={() => onPress?.(item)}>
        {item.nftInfo.imageUrl ? (
          <CommonAvatar style={[itemStyle.left]} imageUrl={item?.nftInfo?.imageUrl} />
        ) : (
          <Text style={[itemStyle.left, itemStyle.noPic]}>{item.symbol[0]}</Text>
        )}
        <View style={itemStyle.right}>
          <View>
            <TextL numberOfLines={1} ellipsizeMode={'tail'} style={[FontStyles.font5]}>
              {`${symbol} #${tokenId}`}
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

const AssetList = ({ toAddress }: { toAddress: string }) => {
  const { t } = useLanguage();
  const [keyword, setKeyword] = useState('');
  const gStyles = useGStyles;

  const debounceKeyword = useDebounce(keyword, 800);

  const [listShow, setListShow] = useState<IAssetItemType[]>([]);
  const pageInfoRef = useRef({
    ...INIT_PAGE_INFO,
  });

  const { navigateTo } = useBaseContainer();

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
        const { multiCaAddresses } = await getUnlockedWallet({ getMultiCaAddresses: true });
        const response = await NetworkController.searchUserAssets({
          caAddressInfos: Object.entries(multiCaAddresses).map(([itemChainId, caAddress]) => {
            return {
              chainId: itemChainId as ChainId,
              caAddress,
              chainName: itemChainId,
            };
          }),
          maxResultCount: MAX_RESULT_COUNT,
          skipCount: pageInfoRef.current.curPage * MAX_RESULT_COUNT,
          keyword: _keyword,
        });

        pageInfoRef.current.curPage = pageInfoRef.current.curPage + 1;
        pageInfoRef.current.total = response.totalRecordCount;
        console.log('fetchAccountAssetsByKeywords:', response);

        if (isInit) {
          setListShow(response.data);
        } else {
          setListShow(pre => pre.concat(response.data));
        }
      } catch (err) {
        console.log('fetchAccountAssetsByKeywords err:', err);
      }
    },
    [listShow.length],
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

  const renderItem = useCallback(
    ({ item }: { item: IAssetItemType }) => {
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
                address: toAddress || '',
                name: '',
              },
            };
            navigateTo(PortkeyEntries.SEND_TOKEN_HOME_ENTRY, {
              params: routeParams,
            });
            // navigationService.navigate('SendHome', routeParams as unknown as IToSendHomeParamsType);
          }}
        />
      );
    },
    [navigateTo, toAddress],
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
        t={t}
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
        data={listShow || []}
        renderItem={renderItem}
        keyExtractor={(_item, index) => `${index}`}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListEmptyComponent={noData}
        onEndReached={() => getAssetsList()}
      />
    </ModalBody>
  );
};

export const showAssetList = (params?: { toAddress: string }) => {
  const { toAddress = '' } = params || {};
  OverlayModal.show(<AssetList toAddress={toAddress} />, {
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
  font14: {
    fontSize: pTd(14),
  },
});
