import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import useDebounce from 'hooks/useDebounce';
import { darkColors } from 'assets/theme';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchAssetListV2 } from '@portkey-wallet/store/store-ca/assets/api';
import { IAssetItemV2 } from '@portkey-wallet/store/store-ca/assets/type';
import useEffectOnce from 'hooks/useEffectOnce';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useAccountAssetsInfoV2 } from '@portkey-wallet/hooks/hooks-ca/assets';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import GStyles from 'assets/theme/GStyles';
import CommonInputNew from 'components/CommonInputNew';
import PageContainer from 'components/PageContainer';
import SelectAssetTab from '../SelectAssetTab';

const AssetList = () => {
  const { t } = useLanguage();
  const caAddressInfos = useCaAddressInfoList();
  const [keyword, setKeyword] = useState('');
  const { accountAssetsList, fetchAccountAssetsInfoList } = useAccountAssetsInfoV2();

  const debounceKeyword = useDebounce(keyword, 800);

  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const [filteredListShow, setFilteredListShow] = useState<IAssetItemV2>({ nftInfos: [], tokenInfos: [] });

  const assetListShow = useMemo(() => {
    if (debounceKeyword) {
      return filteredListShow;
    } else {
      return accountAssetsList;
    }
  }, [accountAssetsList, debounceKeyword, filteredListShow]);

  const getAssetsList = useLockCallback(async () => {
    try {
      await fetchAccountAssetsInfoList({
        caAddressInfos,
        keyword: '',
      });
    } catch (error) {
      console.log('fetchAccountAssetsByKeywords err:', error);
    }
  }, [caAddressInfos, fetchAccountAssetsInfoList]);

  const getFilteredAssetsList = useLockCallback(async () => {
    if (!debounceKeyword.trim()) return;
    try {
      const { nftInfos, tokenInfos } = await fetchAssetListV2({
        caAddressInfos,
        keyword: debounceKeyword,
      });
      setFilteredListShow({ nftInfos, tokenInfos });
    } catch (err) {
      console.log('fetchAccountAssetsByKeywords err:', err);
    }
  }, [caAddressInfos, debounceKeyword]);

  useEffect(() => {
    getFilteredAssetsList();
  }, [getFilteredAssetsList]);

  useEffectOnce(() => {
    getTokenPrice();
    getAssetsList();
  });

  const noDataMessage = useMemo(() => {
    return debounceKeyword ? 'No results found' : 'There are currently no assets to send.';
  }, [debounceKeyword]);

  return (
    <PageContainer
      titleDom={t(`Select Asset to Send`)}
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <CommonInputNew
        allowClear
        placeholder={t('Search')}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        value={keyword}
        onChangeText={v => {
          setKeyword(v.trim());
        }}
      />
      <SelectAssetTab {...assetListShow} noDataMessage={noDataMessage} />
    </PageContainer>
  );
};

export default AssetList;

export const styles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: darkColors.bgBase1,
    ...GStyles.paddingArg(0),
  },
  title: {
    textAlign: 'center',
    height: pTd(22),
    lineHeight: pTd(22),
    marginTop: pTd(17),
    marginBottom: pTd(16),
    fontSize: pTd(20),
  },
  containerStyle: {
    height: pTd(52),
    ...GStyles.paddingArg(0, 16, 12, 16),
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
