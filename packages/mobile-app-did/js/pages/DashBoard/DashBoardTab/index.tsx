import React, { useMemo } from 'react';
import TokenSection from '../TokenSection';
import NFTSection from '../NFTSection/index';
import CommonTopTab from 'components/CommonTopTab';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';

const DashBoardTab: React.FC = () => {
  const { t } = useLanguage();
  const styles = getStyles();

  const tabList = useMemo(() => {
    return [
      {
        name: t('Tokens'),
        tabItemDom: <TokenSection />,
      },
      // {
      //   name: t('NFTs'),
      //   tabItemDom: <NFTSection />,
      // },
    ];
  }, [t]);

  return (
    <CommonTopTab
      swipeEnabled
      hasTabBarBorderRadius={false}
      hasBottomBorder={false}
      tabList={tabList}
      tabContainerStyle={styles.tabContainerStyle}
    />
  );
};

export const getStyles = makeStyles(theme => ({
  tabContainerStyle: {
    backgroundColor: theme.colors.bgBase2,
    borderTopLeftRadius: pTd(16),
    borderTopRightRadius: pTd(16),
  },
}));

export default DashBoardTab;
