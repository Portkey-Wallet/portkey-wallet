import { useEffectOnce } from '@portkey-wallet/hooks';
import { useAccountAssetsInfoV2 } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { fetchAssetListV2 } from '@portkey-wallet/store/store-ca/assets/api';
import { IAssetItemV2 } from '@portkey-wallet/store/store-ca/assets/type';
import useDebounce from 'hooks/useDebounce';
import { useCallback, useEffect, useMemo, useState } from 'react';

const initFilteredListShow = { nftInfos: [], tokenInfos: [] };

export default function SelectAssetList() {
  const caAddressInfos = useCaAddressInfoList();
  const [keyword, setKeyword] = useState('');
  const { accountAssetsList, fetchAccountAssetsInfoList } = useAccountAssetsInfoV2();
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
      await fetchAccountAssetsInfoList({
        caAddressInfos,
        keyword: '',
      });
      setIsFetching(false);
    } catch (error) {
      console.log('fetchAccountAssetsByKeywords err:', error);
    }
  }, [caAddressInfos, fetchAccountAssetsInfoList]);

  const getFilteredAssetsList = useLockCallback(async () => {
    if (!debounceKeyword.trim()) {
      return;
    }
    try {
      setIsFetching(true);
      const { nftInfos, tokenInfos } = await fetchAssetListV2({
        caAddressInfos,
        keyword: debounceKeyword,
      });
      setFilteredListShow({ nftInfos, tokenInfos });
      setIsFetching(false);
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

  // TODO
  const test = useCallback(() => {
    console.log(noDataMessage, isFetching, assetListShow, setKeyword);
  }, [assetListShow, isFetching, noDataMessage]);

  return (
    <div>
      <div onClick={test}>{noDataMessage}</div>
    </div>
  );
}
