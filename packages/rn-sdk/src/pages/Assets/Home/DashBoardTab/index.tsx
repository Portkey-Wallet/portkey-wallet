import React, { useMemo } from 'react';
import TokenSection from '../TokenSection';
import NFTSection from '../NFTSection';
import { useLanguage } from 'i18n/hooks';
import { RNTabView } from 'model/hooks/tabs';

export enum DashBoardTabEnum {
  TOKENS = 'tokens',
  NFTS = 'nfts',
}

const DashBoardTab: React.FC = () => {
  const { t } = useLanguage();
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
  return <RNTabView tabs={DashBoardTabConfig} defaultTab={DashBoardTabEnum.TOKENS} />;
};

export default DashBoardTab;
