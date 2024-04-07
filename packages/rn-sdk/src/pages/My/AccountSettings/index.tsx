import React, { useCallback, useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import useBiometricsReady from 'hooks/useBiometrics';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import MenuItem from '../components/MenuItem';
import { pTd } from 'utils/unit';
import BaseContainerContext from 'model/container/BaseContainerContext';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import useEffectOnce from 'hooks/useEffectOnce';
import { isWalletUnlocked } from 'model/verify/core';
import { PortkeyModulesEntity } from 'service/native-modules';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import useNavigation, { useNewIntent } from '@portkey-wallet/rn-core/router/hook';

export default function AccountSettings() {
  const biometricsReady = useBiometricsReady();
  const navigation = useNavigation();
  useNewIntent<{ modified: boolean }>(params => {
    if (params.modified) {
      CommonToast.success(t('Modified Successfully'));
    }
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
      if (menuName === 'CheckPin') {
        navigation.navigate(PortkeyEntries.CHECK_PIN, { targetScene: 'changePin' });
      } else if (menuName === 'Biometric') {
        navigation.navigate(PortkeyEntries.BIOMETRIC_SWITCH_ENTRY);
      }
    },
    [navigation],
  );
  useEffectOnce(() => {
    isWalletUnlocked().then(status => {
      if (!status) {
        navigation.goBack({
          status: 'fail',
          data: { msg: 'wallet is not unlocked' },
        });
        PortkeyModulesEntity.NativeWrapperModule.onError(
          PortkeyEntries.ACCOUNT_SETTING_ENTRY,
          'wallet is not unlocked',
          {},
        );
      }
    });
  });
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
    paddingHorizontal: pTd(20),
  },
  itemWrap: {
    marginTop: pTd(24),
    marginBottom: 0,
  },
});
