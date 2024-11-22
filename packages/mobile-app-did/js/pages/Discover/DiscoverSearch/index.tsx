import React from 'react';
import { StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';

import DiscoverSearchContent from './components/DiscoverSearchContent';
import { RouteProp, useRoute } from '@react-navigation/native';
import navigationService from 'utils/navigationService';

export default function DiscoverSearch() {
  const {
    params: { address },
  } = useRoute<RouteProp<{ params: { address?: string; onClose?(): void } }>>();

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['black', 'black']}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <DiscoverSearchContent address={address} onBack={navigationService.goBack} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});
