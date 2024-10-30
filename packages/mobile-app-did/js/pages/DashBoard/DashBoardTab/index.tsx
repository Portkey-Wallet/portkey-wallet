import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import TokenSection from '../TokenSection';
import NFTSection from '../NFTSection/index';
import CommonTopTab from 'components/CommonTopTab';
import { darkColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';

const DashBoardTab: React.FC = () => {
  const { t } = useLanguage();

  const tabList = useMemo(() => {
    return [
      {
        name: t('Tokens'),
        tabItemDom: <TokenSection />,
      },
      {
        name: t('NFTs'),
        tabItemDom: <NFTSection />,
      },
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

const styles = StyleSheet.create({
  tabContainerStyle: {
    backgroundColor: darkColors.bgNeutral2,
    borderTopLeftRadius: pTd(16),
    borderTopRightRadius: pTd(16),
  },
});

export default DashBoardTab;
