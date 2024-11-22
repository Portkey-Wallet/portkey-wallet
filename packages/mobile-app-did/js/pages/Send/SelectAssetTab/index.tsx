import React, { useMemo } from 'react';
import CommonTopTab from 'components/CommonTopTab';
import { useLanguage } from 'i18n/hooks';
import { IAssetNftCollection, IAssetToken } from '@portkey-wallet/store/store-ca/assets/type';
import SelectToken from '../SelectToken';
import SelectNFT from '../SelectNFT';
import { pTd } from 'utils/unit';
import { useTheme } from '@rneui/themed';

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
  const { theme } = useTheme();

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
    <CommonTopTab
      swipeEnabled
      hasTabBarBorderRadius={false}
      hasBottomBorder={false}
      tabList={tabList}
      labelFocusStyle={{
        paddingHorizontal: pTd(8),
        paddingVertical: pTd(8),
        borderRadius: pTd(8),
        backgroundColor: theme.colors.bgBase2,
      }}
    />
  );
};
export default SelectAssetTab;
