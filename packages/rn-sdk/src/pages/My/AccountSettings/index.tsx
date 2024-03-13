import React, { useCallback, useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import useBiometricsReady from 'hooks/useBiometrics';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import MenuItem from '../components/MenuItem';
import { pTd } from 'utils/unit';
import BaseContainerContext from 'model/container/BaseContainerContext';
import { PortkeyEntries } from 'config/entries';
import useBaseContainer from 'model/container/UseBaseContainer';
import { CheckPinProps } from 'pages/Pin/CheckPin';
import useEffectOnce from 'hooks/useEffectOnce';
import { isWalletUnlocked } from 'model/verify/core';
import { PortkeyModulesEntity } from 'service/native-modules';
import CommonToast from 'components/CommonToast';
export default function AccountSettings() {
  const biometricsReady = useBiometricsReady();
  const { navigateTo, onFinish } = useBaseContainer({
    entryName: PortkeyEntries.ACCOUNT_SETTING_ENTRY,
    onNewIntent: (params: { modified: boolean }) => {
      console.log('params.modified', params.modified);
      if (params.modified) {
        console.log('params.modified if');
        CommonToast.success(t('Modified Successfully'));
      }
    },
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
        navigateTo<CheckPinProps>(PortkeyEntries.CHECK_PIN, { targetScene: 'changePin' });
      } else if (menuName === 'Biometric') {
        navigateTo(PortkeyEntries.BIOMETRIC_SWITCH_ENTRY, {});
      }
    },
    [navigateTo],
  );
  useEffectOnce(() => {
    isWalletUnlocked().then(status => {
      if (!status) {
        onFinish({
          status: 'fail',
          data: { msg: 'wallet is not unlocked' },
        });
        console.log('wallet is not unlocked');
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
