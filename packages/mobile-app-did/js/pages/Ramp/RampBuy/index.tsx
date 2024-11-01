import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { makeStyles } from '@rneui/themed';
import GStyles from 'assets/theme/GStyles';
import PageContainer from 'components/PageContainer';
import React from 'react';
import BuyFormV2, { IBuyFormV2Props } from '../components/BuyFormV2';

export default function RampBuy() {
  const styles = getStyles();
  const { symbol } = useRouterParams<IBuyFormV2Props>();

  return (
    <PageContainer titleDom={`Buy ${symbol}`} containerStyles={styles.pageWrap} scrollViewProps={{ disabled: true }}>
      <BuyFormV2 />
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
