import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import CommonInput from 'components/CommonInput';
import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { useLanguage } from 'i18n/hooks';
import GameSection from '../components/GameSection';
import { GamesList } from './GameData';
import SimulatedInputBox from '../components/SimulatedInputBox';

export default function DiscoverHome() {
  const { t } = useLanguage();

  const navigateToSearch = useCallback(() => navigationService.navigate('DiscoverSearch'), []);

  return (
    <PageContainer
      titleDom={'Discover'}
      noLeftDom
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <SimulatedInputBox onClickInput={navigateToSearch} />
      <GameSection data={GamesList} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
});
