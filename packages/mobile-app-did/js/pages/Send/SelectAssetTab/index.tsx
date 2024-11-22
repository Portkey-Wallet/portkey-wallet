import React, { useMemo } from 'react';
import CommonTopTab from 'components/CommonTopTab';
import { useLanguage } from 'i18n/hooks';
import { IAssetNftCollection, IAssetToken } from '@portkey-wallet/store/store-ca/assets/type';
import SelectToken from '../SelectToken';
import SelectNFT from '../SelectNFT';

type SelectAssetTabProps = {
  nftInfos: IAssetNftCollection[];
  tokenInfos: IAssetToken[];
  noDataMessage: string;
  toAddress?: string;
  loading: boolean;
};

const SelectAssetTab: React.FC<SelectAssetTabProps> = (props: SelectAssetTabProps) => {
  const { t } = useLanguage();
  const { tokenInfos, noDataMessage, nftInfos, toAddress, loading } = props;

  const tabList = useMemo(() => {
    return [
      {
        name: t('Tokens'),
        tabItemDom: (
          <SelectToken loading={loading} toAddress={toAddress} tokenInfos={tokenInfos} noDataMessage={noDataMessage} />
        ),
      },
      {
        name: t('NFTs'),
        tabItemDom: (
          <SelectNFT loading={loading} toAddress={toAddress} nftInfos={nftInfos} noDataMessage={'No NFTs available'} />
        ),
      },
    ];
  }, [nftInfos, noDataMessage, t, toAddress, tokenInfos, loading]);

  return (
    <CommonTopTab swipeEnabled hasTabBarBorderRadius={false} hasBottomBorder={false} tabList={tabList} isBlockTab />
  );
};
export default SelectAssetTab;
