import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import { TextM } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import MenuItem from './components/MenuItem';
import { RootStackName } from 'navigation';
import { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import myEvents from 'utils/deviceEvent';

interface MenuItemType {
  name: RootStackName;
  label: string;
  icon: IconName;
}

const MenuList: Array<MenuItemType> = [
  {
    name: 'WalletHome',
    label: 'Wallet',
    icon: 'wallet',
  },
  {
    name: 'ContactsHome',
    label: 'Contacts',
    icon: 'contact2',
  },
  {
    name: 'AccountSettings',
    label: 'Account Setting',
    icon: 'setting2',
  },
  {
    name: 'GuardianHome',
    label: 'Guardians',
    icon: 'guardian',
  },
  {
    name: 'WalletSecurity',
    label: 'Wallet Security',
    icon: 'wallet-security',
  },
];

export default function MyMenu({ navigation }: any) {
  const { t } = useLanguage();
  const isImputation = useIsImputation();

  const navToChat = useCallback(
    (tabName: RootStackName) => {
      if (navigation && navigation.jumpTo) {
        navigation.jumpTo(tabName);
      }
    },
    [navigation],
  );

  // nav to chat tab
  useEffect(() => {
    const listener = myEvents.navToBottomTab.addListener(({ tabName }) => navToChat(tabName));
    return () => listener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer
      leftDom={<TextM />}
      titleDom={t('My')}
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.container}>
      {MenuList.map(ele => {
        return (
          <MenuItem
            showWarningCycle={ele.name === 'ContactsHome' && isImputation}
            style={styles.menuItemWrap}
            icon={ele?.icon || 'setting'}
            title={t(ele.label)}
            key={ele.name}
            iconStyle={styles.MenuItemIconStyle}
            onPress={() => navigationService.navigate(ele.name)}
          />
        );
      })}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    paddingTop: pTd(9),
    paddingHorizontal: 0,
  },
  menuItemWrap: {
    height: pTd(63),
    borderBottomColor: defaultColors.border6,
    borderRadius: 0,
    paddingHorizontal: pTd(20),
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: pTd(1),
  },
  MenuItemIconStyle: {
    marginRight: pTd(16),
  },
});
