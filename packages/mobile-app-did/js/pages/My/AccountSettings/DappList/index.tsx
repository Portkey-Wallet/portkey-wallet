import React from 'react';
import PageContainer from 'components/PageContainer';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { useCurrentDappList } from '@portkey-wallet/hooks/hooks-ca/dapp';
import NoData from 'components/NoData';
import navigationService from 'utils/navigationService';
import DappListItem from './components/DappListItem';
import { makeStyles } from '@rneui/themed';

const DappList: React.FC = () => {
  const dappList = useCurrentDappList();
  const styles = getStyles();

  return (
    <PageContainer
      titleDom={'Connected Sites'}
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: false }}>
      {dappList?.map(item => (
        <DappListItem
          key={item.origin}
          item={item}
          onPress={() => navigationService.navigate('DappDetail', { origin: item.origin })}
        />
      ))}
      {(dappList ?? []).length === 0 && <NoData style={styles.noData} message="No connected dApps" noPic />}
    </PageContainer>
  );
};

const getStyles = makeStyles(theme => ({
  pageWrap: {
    backgroundColor: theme.colors.bg4,
    ...GStyles.paddingArg(16, 0, 0, 0),
  },
  tipsWrap: {
    lineHeight: pTd(20),
    marginBottom: pTd(24),
  },
  noData: {
    backgroundColor: theme.colors.bg4,
  },
}));

export default DappList;
