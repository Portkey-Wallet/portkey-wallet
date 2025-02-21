import React, { useState, useEffect, useMemo } from 'react';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import useDebounce from 'hooks/useDebounce';
import { useCurrentAddressInfos } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { fetchAssetListV2 } from '@portkey-wallet/store/store-eoa/assets/api';
import { IAssetItemV2 } from '@portkey-wallet/store/store-eoa/assets/type';
import useEffectOnce from 'hooks/useEffectOnce';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-eoa/useTokensPrice';
import { useAccountAssetsInfoV2 } from '@portkey-wallet/hooks/hooks-eoa/assets';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import GStyles from 'assets/theme/GStyles';
import CommonInput from 'components/CommonInput';
import PageContainer from 'components/PageContainer';
import SelectAssetTab from '../SelectAssetTab';
import { makeStyles } from '@rneui/themed';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import Loading from 'components/Loading';

const initFilteredListShow = { nftInfos: [], tokenInfos: [] };

const AssetList = () => {
  // when scan qrcode should add toAddress
  const { toAddress = '' } = useRouterParams<{ toAddress?: string }>();

  const { t } = useLanguage();
  const addressInfos = useCurrentAddressInfos();
  const [keyword, setKeyword] = useState('');
  const { accountAssetsList, fetchAccountAssetsInfoList } = useAccountAssetsInfoV2();
  const styles = getStyles();
  const debounceKeyword = useDebounce(keyword, 800);
  const [isFetching, setIsFetching] = useState(false);
  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const [filteredListShow, setFilteredListShow] = useState<IAssetItemV2>(initFilteredListShow);

  const assetListShow = useMemo(() => {
    if (debounceKeyword) {
      return filteredListShow;
    } else {
      setFilteredListShow(initFilteredListShow);
      return accountAssetsList;
    }
  }, [accountAssetsList, debounceKeyword, filteredListShow]);
  const getAssetsList = useLockCallback(async () => {
    try {
      setIsFetching(true);
      Loading.show();
      await fetchAccountAssetsInfoList({
        addressInfos,
        keyword: '',
      });
      Loading.hide();
      setIsFetching(false);
    } catch (error) {
      console.log('fetchAccountAssetsByKeywords err:', error);
    }
  }, [addressInfos, fetchAccountAssetsInfoList]);

  const getFilteredAssetsList = useLockCallback(async () => {
    if (!debounceKeyword.trim()) {
      return;
    }
    try {
      setIsFetching(true);
      Loading.show();
      const { nftInfos, tokenInfos } = await fetchAssetListV2({
        addressInfos,
        keyword: debounceKeyword,
      });
      Loading.hide();
      setFilteredListShow({ nftInfos, tokenInfos });
      setIsFetching(false);
    } catch (err) {
      console.log('fetchAccountAssetsByKeywords err:', err);
    }
  }, [addressInfos, debounceKeyword]);

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
      titleDom={t('Select Asset to Send')}
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <CommonInput
        allowClear
        clearIcon="clear4"
        placeholder={t('Search')}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        value={keyword}
        onChangeText={v => {
          setKeyword(v.trim());
        }}
      />
      <SelectAssetTab loading={isFetching} toAddress={toAddress} {...assetListShow} noDataMessage={noDataMessage} />
    </PageContainer>
  );
};

export default AssetList;

export const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
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
}));
