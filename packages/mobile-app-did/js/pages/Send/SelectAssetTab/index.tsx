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
};

const SelectAssetTab: React.FC<SelectAssetTabProps> = (props: SelectAssetTabProps) => {
  const { t } = useLanguage();
  const { tokenInfos, noDataMessage, nftInfos } = props;

  const tabList = useMemo(() => {
    return [
      {
        name: t('Tokens'),
        tabItemDom: <SelectToken tokenInfos={tokenInfos} noDataMessage={noDataMessage} />,
      },
      {
        name: t('NFTs'),
        tabItemDom: <SelectNFT nftInfos={nftInfos} noDataMessage={noDataMessage} />,
      },
    ];
  }, [nftInfos, noDataMessage, t, tokenInfos]);

  return <CommonTopTab swipeEnabled hasTabBarBorderRadius={false} hasBottomBorder={false} tabList={tabList} />;
};
export default SelectAssetTab;
