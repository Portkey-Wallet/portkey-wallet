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

export default function DiscoverHome() {
  const { t } = useLanguage();

  const navigateToSearch = useCallback(() => {
    console.log('aaa');

    return navigationService.navigate('DiscoverSearch');
  }, []);

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <View style={[BGStyles.bg5, styles.inputContainer]}>
        <CommonInput placeholder={t('Enter URL to explore')} onFocus={() => navigateToSearch()} />
      </View>
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
