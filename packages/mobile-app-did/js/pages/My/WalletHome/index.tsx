import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useEffect } from 'react';
import { pTd } from 'utils/unit';
import { ScrollView, View } from 'react-native';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import { BorderStyles, FontStyles } from 'assets/theme/styles';
import Svg, { IconName } from 'components/Svg';
import MenuItem from '../components/MenuItem';
import ExistOverlay from './components/ExistOverlay';
import Loading from 'components/Loading';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CommonToast from 'components/CommonToast';
import useLogOut from 'hooks/useLogOut';
import { removeManager } from 'utils/guardian';
import { useGetCurrentCAContract } from 'hooks/contract';
import { useAppDispatch } from 'store/hooks';
import { getCaHolderInfoAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import FormItem from 'components/FormItem';
import WalletMenuItem from '../components/WalletMenuItem';

interface WalletHomeProps {
  name?: string;
}

const WalletHome: React.FC<WalletHomeProps> = () => {
  const { t } = useLanguage();
  const appDispatch = useAppDispatch();
  const {
    walletName,
    walletAvatar,
    walletInfo: { caHash, address: managerAddress },
  } = useCurrentWallet();
  const getCurrentCAContract = useGetCurrentCAContract();
  const logout = useLogOut();
  const showChat = useIsChatShow();

  useEffect(() => {
    appDispatch(getCaHolderInfoAsync());
  }, [appDispatch]);

  const onExitClick = useCallback(
    async (isConfirm: boolean) => {
      if (!isConfirm || !managerAddress || !caHash) return;
      Loading.show({ text: t('Signing out of Portkey...') });
      try {
        const caContract = await getCurrentCAContract();
        const req = await removeManager(caContract, managerAddress, caHash);
        if (req && !req.error) {
          console.log('logout success', req);
          logout();
        } else {
          CommonToast.fail(req?.error?.message || '');
        }
      } catch (error) {
        console.log(error, '=====error');

        CommonToast.failError(error);
      }
      Loading.hide();
    },
    [caHash, getCurrentCAContract, logout, managerAddress, t],
  );

  return (
    <PageContainer
      titleDom={t('Wallet')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={[pageStyles.pageWrap]}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.avatarWrap}>
        <Svg icon={(walletAvatar as IconName) || 'master1'} size={pTd(80)} />
      </View>
      <ScrollView alwaysBounceVertical={false}>
        <View>
          <WalletMenuItem />
          <MenuItem
            style={pageStyles.menuItem}
            onPress={() => navigationService.navigate('AutoLock')}
            title={t('Auto-Lock')}
          />
          <MenuItem
            style={pageStyles.menuItem}
            onPress={() => navigationService.navigate('SwitchNetworks')}
            title={t('Switch Networks')}
          />
          <MenuItem
            style={pageStyles.menuItem}
            onPress={() => navigationService.navigate('AboutUs')}
            title={t('About Us')}
          />
        </View>
      </ScrollView>

      <CommonButton
        type="outline"
        containerStyle={[GStyles.paddingTop(16), GStyles.marginArg(2, 4), BorderStyles.border7]}
        buttonStyle={[BorderStyles.border7]}
        titleStyle={FontStyles.font12}
        onPress={() => {
          ExistOverlay.showExistOverlay({
            callBack: onExitClick,
          });
        }}>
        {t('Exit Wallet')}
      </CommonButton>
    </PageContainer>
  );
};
export default WalletHome;

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(0, 16, 18),
  },
  avatarWrap: {
    height: pTd(160),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    marginBottom: pTd(12),
  },
});
