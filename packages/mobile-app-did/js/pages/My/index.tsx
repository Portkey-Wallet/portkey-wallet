import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import { TextM, TextS } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import MenuItem from './components/MenuItem';
import { RootStackName } from 'navigation';
import { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import { useReferral } from '@portkey-wallet/hooks/hooks-ca/referral';

interface MenuItemType {
  name: RootStackName;
  label: string;
  icon: IconName;
  suffixDom?: React.ReactNode;
  onPress?: () => void;
}

export default function MyMenu() {
  const { t } = useLanguage();
  const isImputation = useIsImputation();

  const { setViewReferralStatusStatus } = useReferral();

  const MenuList: Array<MenuItemType> = useMemo(
    () => [
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
      {
        name: 'UserReferral',
        label: 'Referral',
        icon: 'referral',
        suffixDom: <TextS style={styles.newStyle}>New</TextS>,
        onPress: () => {
          setViewReferralStatusStatus();
          navigationService.navigate('UserReferral');
        },
      },
    ],
    [setViewReferralStatusStatus],
  );

  return (
    <PageContainer leftDom={<TextM />} titleDom={t('My')} safeAreaColor={['white']} containerStyles={styles.container}>
      {MenuList.map(ele => {
        return (
          <MenuItem
            showWarningCycle={ele.name === 'ContactsHome' && isImputation}
            style={styles.menuItemWrap}
            icon={ele?.icon || 'setting'}
            title={t(ele.label)}
            key={ele.name}
            iconStyle={styles.menuItemIconStyle}
            onPress={ele.onPress ? ele.onPress : () => navigationService.navigate(ele.name)}
            suffix={ele.suffixDom}
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
  menuItemIconStyle: {
    marginRight: pTd(16),
  },
  newStyle: {
    width: pTd(40),
    height: pTd(20),
    marginRight: pTd(4),
    textAlign: 'center',
    lineHeight: pTd(20),
    borderRadius: pTd(4),
    overflow: 'hidden',
    backgroundColor: defaultColors.bg27,
    color: defaultColors.font13,
  },
});
