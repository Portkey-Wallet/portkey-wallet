import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from 'i18n/hooks';
import { ITokenSectionResponse } from '@portkey-wallet/types/types-ca/token';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TokenTitle } from 'components/TokenTitle';
import NoData from 'components/NoData';
import TokenDetailPage from '../components/TokenDetailPage';
import TokenDetailTopTab from '../components/TokenDetailTopTab';

interface RouterParams {
  tokenSection: ITokenSectionResponse;
  index: number;
}

const TokenDetail: React.FC = () => {
  const { t } = useLanguage();
  const { tokenSection, index } = useRouterParams<RouterParams>();
  const navigation = useNavigation();

  const contentDom = useMemo(() => {
    if (!tokenSection.tokens || tokenSection.tokens.length < 1) {
      return <NoData noPic message={t('No Data')} />;
    }
    if (tokenSection.tokens?.length === 1) {
      return <TokenDetailPage tokenInfo={tokenSection.tokens[0]} />;
    } else {
      return (
        <TokenDetailTopTab
          initialRouteName={tokenSection.tokens[index].chainId}
          tabList={tokenSection.tokens.map(token => {
            return { name: token.chainId, tabItemDom: <TokenDetailPage tokenInfo={token} /> };
          })}
        />
      );
    }
  }, [index, t, tokenSection.tokens]);

  return (
    <PageContainer
      type="leftBack"
      backTitle={t('')}
      titleDom={<TokenTitle symbol={tokenSection.symbol} imageUrl={tokenSection.imageUrl} label={tokenSection.label} />}
      leftCallback={() => navigation.goBack()}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      {contentDom}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  pageWrap: {
    paddingHorizontal: 0,
  },
});

export default TokenDetail;
