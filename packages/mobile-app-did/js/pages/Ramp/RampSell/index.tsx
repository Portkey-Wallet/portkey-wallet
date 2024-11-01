import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { makeStyles } from '@rneui/themed';
import GStyles from 'assets/theme/GStyles';
import PageContainer from 'components/PageContainer';
import React from 'react';

import SellFormV2, { ISellFormV2Props } from '../components/SellFormV2';

export default function RampSell() {
  const styles = getStyles();
  const { symbol } = useRouterParams<ISellFormV2Props>();

  return (
    <PageContainer titleDom={`Sell ${symbol}`} containerStyles={styles.pageWrap} scrollViewProps={{ disabled: true }}>
      <SellFormV2 />
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    ...GStyles.paddingArg(16, 16),
  },
}));
