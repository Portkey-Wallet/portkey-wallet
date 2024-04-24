import React, { useMemo } from 'react';
import TokenSection from '../TokenSection';
import NFTSection from '../NFTSection/index';
import CommonTopTab from 'components/CommonTopTab';

import { useLanguage } from 'i18n/hooks';
type DashBoardTabProps = {
  getAccountBalance?: () => void;
};

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

  return <CommonTopTab swipeEnabled hasTabBarBorderRadius={false} tabList={tabList} />;
};
export default DashBoardTab;
