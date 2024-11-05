import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useEffect } from 'react';
import { pTd } from 'utils/unit';
import { ScrollView, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import MenuItem from '../components/MenuItem';
import { useAppDispatch } from 'store/hooks';
import { getCaHolderInfoAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import WalletMenuItem from '../components/WalletMenuItem';

interface SecurityProps {
  name?: string;
}

const Security: React.FC<SecurityProps> = () => {
  const { t } = useLanguage();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(getCaHolderInfoAsync());
  }, [appDispatch]);

  return (
    <PageContainer
      titleDom={t('Security')}
      safeAreaColor={['black']}
      containerStyles={[pageStyles.pageWrap]}
      scrollViewProps={{ disabled: true }}>
      <ScrollView alwaysBounceVertical={false}>
        <View>
          <MenuItem
            style={pageStyles.menuItem}
            onPress={() => navigationService.navigate('AutoLock')}
            title={t('Auto-Lock')}
            icon="my_auto_lock"
          />
          <MenuItem
            style={pageStyles.menuItem}
            onPress={() => navigationService.navigate('Beometic')}
            title={t('Biometric authentication')}
            icon="my_biometric"
          />
          <MenuItem
            style={pageStyles.menuItem}
            onPress={() => navigationService.navigate('CheckPin')}
            title={t('Change PIN')}
            icon="my_biometric"
          />
        </View>
      </ScrollView>
    </PageContainer>
  );
};
export default Security;

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg19,
    ...GStyles.paddingArg(12, 16),
  },
  menuItem: {
    height: pTd(63),
    borderRadius: 0,
    paddingHorizontal: pTd(0),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
