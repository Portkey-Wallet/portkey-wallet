import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useMemo } from 'react';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { View, StyleSheet } from 'react-native';
import { useCurrentCaInfo, useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import ProfilePortkeyIDSection from 'pages/My/components/ProfileIDSection';
import ProfileHeaderSection from 'pages/My/components/ProfileHeaderSection';
import ProfileAddressSection from 'pages/My/components/ProfileAddressSection';

import { defaultColors } from 'assets/theme';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { windowHeight } from '@portkey-wallet/utils/mobile/device';
import { headerHeight } from 'components/CustomHeader/style/index.style';
import { FontStyles } from 'assets/theme/styles';
import { useIsShowDeletion } from 'hooks/account';
import { isIOS } from '@rneui/base';
import { pTd } from 'utils/unit';
const PageHeight = windowHeight - headerHeight;

const WalletName: React.FC = () => {
  const { t } = useLanguage();
  const userInfo = useCurrentUserInfo();
  const caInfo = useCurrentCaInfo();
  const showDeletion = useIsShowDeletion();

  const caInfoList = useMemo(() => {
    const result: { address: string; chainId: ChainId }[] = [];
    Object.entries(caInfo || {}).map(([key, value]) => {
      const info = value as CAInfo;
      if (info?.caAddress) {
        result.push({
          address: info?.caAddress,
          chainId: key as ChainId,
        });
      }
    });
    return result;
  }, [caInfo]);

  // const onNameChange = useCallback((value: string) => {
  //   setNameValue(value);
  //   setNameError({ ...INIT_HAS_ERROR });
  // }, []);

  // const onSave = useCallback(async () => {
  //   const _nameValue = nameValue.trim();
  //   if (_nameValue === '') {
  //     setNameValue('');
  //     setNameError({
  //       isError: true,
  //       errorMsg: t('Please Enter Wallet Name'),
  //     });
  //     return;
  //   }
  //   if (!isValidCAWalletName(_nameValue)) {
  //     setNameError({ ...INIT_HAS_ERROR, errorMsg: t('3-16 characters, only a-z, A-Z, 0-9 and "_" allowed') });
  //     return;
  //   }
  // if (_nameValue === walletName) {
  //   CommonToast.success(t('Saved Successful'), undefined, 'bottom');
  //   navigationService.goBack();
  //   return;
  // }
  //   Loading.show();
  //   try {
  //     await sleep(500); // adjust large size on android
  //     const s3Url = await uploadRef.current?.uploadPhoto();
  //     setAvatar(s3Url || userInfo?.avatar || '');
  //     await setUserInfo({ nickName: _nameValue, avatar: s3Url || userInfo?.avatar || '' });
  //     navigationService.goBack();
  //     CommonToast.success(t('Saved Successful'));
  //   } catch (error: any) {
  //     console.log('setWalletName: error', error);
  //     CommonToast.failError(error);
  //   }
  //   Loading.hide();
  // }, [nameValue, t, setUserInfo, userInfo?.avatar]);

  return (
    <PageContainer titleDom={t('My Profile')} safeAreaColor={['blue', 'gray']} containerStyles={pageStyles.pageWrap}>
      <View style={pageStyles.pageContainer}>
        <View>
          <>
            <ProfileHeaderSection name={userInfo?.nickName || ''} avatarUrl={userInfo?.avatar || ''} />
            <ProfilePortkeyIDSection showQrCodeButton id={userInfo?.userId || ''} />
            <ProfileAddressSection isMySelf addressList={caInfoList} />
          </>
        </View>
        <CommonButton title={'Edit'} type="solid" onPress={() => navigationService.navigate('EditWalletName')} />
      </View>

      {showDeletion && (
        <CommonButton
          title="Delete Account"
          type="clear"
          titleStyle={FontStyles.font7}
          onPress={() => navigationService.navigate('AccountCancelation')}
        />
      )}
    </PageContainer>
  );
};
export default WalletName;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
  },
  pageContainer: {
    paddingTop: 24,
    paddingBottom: isIOS ? 40 : 20,
    height: PageHeight,
    justifyContent: 'space-between',
  },
  setButton: {
    marginTop: pTd(8),
    marginBottom: pTd(24),
  },
});
