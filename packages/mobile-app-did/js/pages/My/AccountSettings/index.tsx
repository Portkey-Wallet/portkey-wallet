import React, { useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import useBiometricsReady from 'hooks/useBiometrics';
import navigationService from 'utils/navigationService';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import MenuItem from '../components/MenuItem';
import { pTd } from 'utils/unit';
import { RootStackName } from 'navigation';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';

export default function AccountSettings() {
  const biometricsReady = useBiometricsReady();
  const showChat = useIsChatShow();

  const { t } = useLanguage();

  const list = useMemo(() => {
    const _list: Array<{
      name: RootStackName;
      label: string;
      sort: number;
    }> = [
      {
        name: 'CheckPin',
        label: 'Change Pin',
        sort: 1,
      },
    ];

    showChat &&
      _list.push({
        name: 'ChatPrivacy',
        label: 'Privacy',
        sort: 3,
      });

    biometricsReady &&
      _list.push({
        name: 'Biometric',
        label: 'Biometric Authentication',
        sort: 2,
      });
    return _list.sort((a, b) => a.sort - b.sort);
  }, [biometricsReady, showChat]);

  return (
    <PageContainer
      containerStyles={styles.containerStyles}
      safeAreaColor={['white', 'gray']}
      titleDom={t('Account Setting')}>
      {list.map(item => (
        <MenuItem
          style={styles.itemWrap}
          key={item.name}
          title={t(item.label)}
          onPress={() => navigationService.navigate(item.name)}
        />
      ))}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg4,
  },
  itemWrap: {
    marginTop: pTd(24),
    marginBottom: 0,
  },
});
