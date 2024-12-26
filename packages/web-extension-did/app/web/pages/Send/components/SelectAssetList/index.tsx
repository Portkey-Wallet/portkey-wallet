import { useEffectOnce } from '@portkey-wallet/hooks';
import { useAccountAssetsInfoV2 } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { fetchAssetListV2 } from '@portkey-wallet/store/store-ca/assets/api';
import { IAssetItemV2, IAssetToken, INftInfoType } from '@portkey-wallet/store/store-ca/assets/type';
import useDebounce from 'hooks/useDebounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CommonTabs, CommonInput, CommonModal } from '@portkey/did-ui-react';
import SelectToken from '../SelectToken';
import SelectNFT from '../SelectNFT';
import { SendPageTypeEnum } from 'pages/Send';
import { useNavigate } from 'react-router';
import PageHeader from 'components/PageHeader';
import { useNavigateState } from 'hooks/router';
import { TSendLocationState } from 'types/router';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { ChainId } from '@portkey-wallet/types';
import './index.less';

const initFilteredListShow = { nftInfos: [], tokenInfos: [] };

export default function SelectAssetList() {
  const caAddressInfos = useCaAddressInfoList();
  const [keyword, setKeyword] = useState('');
  const { accountAssetsList, fetchAccountAssetsInfoList } = useAccountAssetsInfoV2();
  const debounceKeyword = useDebounce(keyword, 800);
  const [isFetching, setIsFetching] = useState(false);
  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const [filteredListShow, setFilteredListShow] = useState<IAssetItemV2>(initFilteredListShow);
  const [curTab, setCurTab] = useState<SendPageTypeEnum>(SendPageTypeEnum.token);
  const navigate = useNavigateState<TSendLocationState>();

  const onSelect = useCallback(
    (v: IAssetToken | INftInfoType, t: SendPageTypeEnum) => {
      navigate(`/send/${t}/${v.symbol}`, { state: { ...v, chainId: v.chainId as ChainId } });
    },
    [navigate],
  );

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

  return (
    <div className="send-asset-list">
      <CommonInput
        type="search"
        placeholder="Search"
        value={keyword}
        onChange={(e) => {
          const v = e.target.value.trim();
          setKeyword(v);
        }}
        className="send-search"
        onClear={() => {
          setKeyword('');
        }}
      />
      <CommonTabs
        className="send-asset-tab"
        activeKey={curTab}
        onChange={(v) => {
          setCurTab(v);
        }}
        items={[
          {
            label: 'Tokens',
            key: SendPageTypeEnum.token,
            children: (
              <SelectToken
                onSelect={(v) => onSelect(v, SendPageTypeEnum.token)}
                tokenInfos={assetListShow.tokenInfos || []}
                loading={isFetching}
                noDataMessage={noDataMessage}
              />
            ),
          },
          {
            label: 'NFTs',
            key: SendPageTypeEnum.nft,
            children: (
              <SelectNFT
                onSelect={(v) => onSelect(v, SendPageTypeEnum.nft)}
                nftInfos={assetListShow?.nftInfos || []}
                loading={isFetching}
                noDataMessage={noDataMessage}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

export function SelectAssetListPage() {
  const navigate = useNavigate();
  const onBack = useCallback(() => {
    navigate('/');
  }, [navigate]);
  return (
    <div className="select-asset-list-page">
      <PageHeader onBackCb={onBack} headerTitle={`Select Asset to Send`} />
      <SelectAssetList />
    </div>
  );
}

export function SelectAssetListModal({ open, onCancel }: { open: boolean; onCancel: () => void }) {
  return (
    <CommonModal open={open} className="select-asset-list-modal">
      <div className="flex-between-center select-asset-list-modal-header">
        <div>{`Select Asset to Send`}</div>
        <CustomSvgV3 type="close thin" className="cursor-pointer" onClick={onCancel} />
      </div>
      <SelectAssetList />
    </CommonModal>
  );
}
