import React from 'react';
import PageContainer from 'components/PageContainer';
import useBiometricsReady from 'hooks/useBiometrics';
import navigationService from 'utils/navigationService';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import MenuItem from '../components/MenuItem';
import { pTd } from 'utils/unit';
import { RootStackName } from 'navigation';

const list: Array<{
  name: RootStackName;
  label: string;
}> = [
  {
    name: 'CheckPin',
    label: 'Change Pin',
  },
];

export default function AccountSettings() {
  const biometricsReady = useBiometricsReady();
  const { t } = useLanguage();

  return (
    <PageContainer
      containerStyles={styles.containerStyles}
      safeAreaColor={['blue', 'gray']}
      titleDom={t('Account Setting')}>
      {list.map(item => (
        <MenuItem
          style={styles.itemWrap}
          key={item.name}
          title={t(item.label)}
          onPress={() => navigationService.navigate(item.name)}
        />
      ))}
      {biometricsReady && (
        <MenuItem
          style={styles.itemWrap}
          title={t('Biometric Authentication')}
          onPress={() => navigationService.navigate('Biometric')}
        />
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    paddingTop: pTd(8),
    backgroundColor: defaultColors.bg4,
  },
  itemWrap: {
    marginTop: pTd(24),
    marginBottom: 0,
  },
});
