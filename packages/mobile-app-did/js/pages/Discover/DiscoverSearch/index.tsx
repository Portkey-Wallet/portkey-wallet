import React from 'react';
import PageContainer from 'components/PageContainer';

import DiscoverSearchContent from './components/DiscoverSearchContent';
import { RouteProp, useRoute } from '@react-navigation/native';
import navigationService from 'utils/navigationService';
import { makeStyles } from '@rneui/themed';

export default function DiscoverSearch() {
  const {
    params: { address },
  } = useRoute<RouteProp<{ params: { address?: string; onClose?(): void } }>>();
  const styles = getStyles();

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['black', 'lightBlack']}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <DiscoverSearchContent address={address} onBack={navigationService.goBack} />
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: theme.colors.bgBase1,
  },
}));
