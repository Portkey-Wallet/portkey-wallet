import React, { useCallback, useEffect, useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import useBiometricsReady from 'hooks/useBiometrics';
import { StyleSheet, Modal, NativeModules } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import MenuItem from '../components/MenuItem';
import { pTd } from 'utils/unit';
import BaseContainerContext from 'model/container/BaseContainerContext';
import { PortkeyEntries } from 'config/entries';
import useBaseContainer from 'model/container/UseBaseContainer';
import { CheckPinProps } from 'pages/Pin/CheckPin';

export default function AccountSettings() {
  const biometricsReady = useBiometricsReady();
  const { navigationTo } = useBaseContainer({
    entryName: PortkeyEntries.ACCOUNT_SETTING_ENTRY,
  });
  const { t } = useLanguage();

  const list = useMemo(() => {
    const _list: Array<{
      name: string;
      label: string;
      sort: number;
    }> = [
      {
        name: 'CheckPin',
        label: 'Change Pin',
        sort: 1,
      },
    ];

    biometricsReady &&
      _list.push({
        name: 'Biometric',
        label: 'Biometric Authentication',
        sort: 2,
      });
    return _list.sort((a, b) => a.sort - b.sort);
  }, [biometricsReady]);
  const navigateNextPage = useCallback(
    (menuName: string) => {
      console.log('menuName', menuName);
      if (menuName === 'CheckPin') {
        navigationTo<CheckPinProps>(PortkeyEntries.CHECK_PIN, { targetScene: 'changePin' });
      } else if (menuName === 'Biometric') {
        navigationTo(PortkeyEntries.BIOMETRIC_SWITCH_ENTRY, {});
      }
    },
    [navigationTo],
  );

  return (
    <BaseContainerContext.Provider value={{ entryName: PortkeyEntries.ACCOUNT_SETTING_ENTRY }}>
      <PageContainer
        containerStyles={styles.containerStyles}
        safeAreaColor={['blue', 'gray']}
        titleDom={t('Account Setting')}>
        {list.map(item => (
          <MenuItem
            style={styles.itemWrap}
            key={item.name}
            title={t(item.label)}
            onPress={() => navigateNextPage(item.name)}
          />
        ))}
      </PageContainer>
    </BaseContainerContext.Provider>
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
