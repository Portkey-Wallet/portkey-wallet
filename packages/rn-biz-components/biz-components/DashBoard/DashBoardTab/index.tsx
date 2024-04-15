import React, { useMemo } from 'react';
import TokenSection from '../TokenSection';
import NFTSection from '../NFTSection/index';
import CommonTopTab from '@portkey-wallet/rn-components/components/CommonTopTab';
import CommRNTopTabView from '@portkey-wallet/rn-components/components/CommRNTopTabView';
import Environment from '@portkey-wallet/rn-inject';

import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
type DashBoardTabProps = {
  getAccountBalance?: () => void;
};
export enum DashBoardTabEnum {
  TOKENS = 'tokens',
  NFTS = 'nfts',
}
const DashBoardTab: React.FC<DashBoardTabProps> = (props: DashBoardTabProps) => {
  const { t } = useLanguage();

  const tabList = useMemo(() => {
    return [
      {
        name: t('Tokens'),
        tabItemDom: <TokenSection {...props} />,
      },
      {
        name: t('NFTs'),
        tabItemDom: <NFTSection />,
      },
    ];
  }, [props, t]);
  const DashBoardTabConfig = useMemo(() => {
    return [
      {
        key: DashBoardTabEnum.TOKENS,
        title: t('Tokens'),
        component: TokenSection,
      },
      {
        key: DashBoardTabEnum.NFTS,
        title: t('NFTs'),
        component: NFTSection,
      },
    ];
  }, [t]);
  if (Environment.isSDK()) {
    return <CommRNTopTabView tabs={DashBoardTabConfig} defaultTab={DashBoardTabEnum.TOKENS} />;
  }
  return <CommonTopTab hasTabBarBorderRadius tabList={tabList} />;
};
export default DashBoardTab;
