import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';
import { useDebounceCallback, useEffectOnce } from '@portkey-wallet/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchCryptoBoxAssetList } from '@portkey-wallet/store/store-ca/assets/api';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { DrawerProps, ModalProps } from 'antd';
import BaseModal from 'components/BaseModal';
import CommonHeader from 'components/CommonHeader';
import DropdownSearch from 'components/DropdownSearch';
import BaseDrawer from 'pages/components/BaseDrawer';
import NFTImageDisplay from 'pages/components/NFTImageDisplay';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { useCallback, useMemo, useState } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';

interface ISelectAssetProps extends ModalProps, DrawerProps {
  onSelectAsset: (cur: ICryptoBoxAssetItemType, other?: ICryptoBoxAssetItemType) => void;
  onClose: () => void;
}

export default function SelectAsset(props: ISelectAssetProps) {
  const { open, onClose, onSelectAsset } = props;
  const isMainnet = useIsMainnet();
  const { isNotLessThan768 } = useCommonState();
  const caAddressInfos = useCaAddressInfoList();
  const [filter, setFilter] = useState<string>();
  const [allList, setAllList] = useState<ICryptoBoxAssetItemType[]>([]);
  const [filterList, setFilterList] = useState<ICryptoBoxAssetItemType[]>([]);

  const fetchAssetList = useCallback(
    async (keyword = '') => {
      try {
        const response = await fetchCryptoBoxAssetList({
          caAddressInfos,
          maxResultCount: 1000,
          skipCount: 0,
          keyword,
        });
        keyword ? setFilterList(response.data) : setAllList(response.data);
        console.log('response', response);
      } catch (error) {
        console.log('===fetchCryptoBoxAssetList error', error);
      }
    },
    [caAddressInfos],
  );
  useEffectOnce(() => {
    fetchAssetList();
  });
  const handleSearch = useDebounceCallback(
    async (keyword: string) => {
      if (!keyword) return;
      fetchAssetList(keyword);
    },
    [fetchAssetList],
    500,
  );
  const onCloseSelectAsset = useCallback(() => {
    setFilter(undefined);
    onClose();
  }, [onClose]);

  const renderAssetList = useMemo(() => {
    const list = filter ? filterList : allList;
    return list.map((item, index) => (
      <div
        className="asset-item flex"
        key={`${item.symbol}_${item.chainId}_${index}`}
        onClick={() => {
          const other = allList.find((temp) => temp.symbol === item.symbol && temp.chainId !== item.chainId);
          onSelectAsset(item, other);
          onCloseSelectAsset();
        }}>
        <div className="icon flex-center">
          {item.assetType === AssetType.ft ? (
            <TokenImageDisplay width={36} symbol={item.symbol} src={item.imageUrl} />
          ) : (
            <NFTImageDisplay width={36} src={item.imageUrl} alias={item.alias} />
          )}
        </div>
        <div className="info flex-column">
          <p className="symbol">{item.label || item.alias || item.symbol}</p>
          <p className="network">{transNetworkText(item.chainId, !isMainnet)}</p>
        </div>
      </div>
    ));
  }, [allList, filter, filterList, isMainnet, onCloseSelectAsset, onSelectAsset]);

  const mainContent = useMemo(
    () => (
      <div className="crypto-gift-select-asset flex-column">
        <CommonHeader
          className="header"
          title={'Select Assets'}
          rightElementList={[
            {
              customSvgType: 'SuggestClose',
              onClick: onCloseSelectAsset,
            },
          ]}
        />
        <DropdownSearch
          overlayClassName="empty-dropdown"
          open={false}
          value={filter}
          overlay={<div className="empty-tip">{'There is no search result.'}</div>}
          inputProps={{
            onChange: (e) => {
              const _value = e.target.value.replaceAll(' ', '');
              setFilter(_value);
              handleSearch(_value);
            },
            placeholder: 'Search Assets',
          }}
        />
        <div className="show-asset-list flex-1">{renderAssetList}</div>
      </div>
    ),
    [filter, handleSearch, onCloseSelectAsset, renderAssetList],
  );

  return isNotLessThan768 ? (
    <BaseModal
      open={open}
      destroyOnClose
      wrapClassName="gift-select-asset-modal"
      maskClosable={true}
      closable={false}
      centered={true}
      onCancel={onCloseSelectAsset}
      footer={null}>
      {mainContent}
    </BaseModal>
  ) : (
    <BaseDrawer
      open={open}
      destroyOnClose
      className="gift-select-asset-drawer"
      height="528"
      maskClosable={true}
      onClose={onCloseSelectAsset}
      placement="bottom">
      {mainContent}
    </BaseDrawer>
  );
}
