import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { View, StyleSheet } from 'react-native';
import { useCurrentCaInfo, useSetUserInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
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
import Touchable from 'components/Touchable';

import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { INIT_HAS_ERROR, ErrorType } from '@portkey-wallet/constants/constants-ca/common';
import FormItem from 'components/FormItem';
import CommonInput from 'components/CommonInput';
import { isIOS } from '@rneui/base';
import GStyles from 'assets/theme/GStyles';
import ImageWithUploadFunc, { ImageWithUploadFuncInstance } from 'components/ImageWithUploadFunc';
import { TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { sleep } from '@portkey-wallet/utils';
const PageHeight = windowHeight - headerHeight;

const WalletName: React.FC = () => {
  const { t } = useLanguage();
  const uploadRef = useRef<ImageWithUploadFuncInstance>(null);

  const { userInfo } = useWallet();
  const caInfo = useCurrentCaInfo();
  const showDeletion = useIsShowDeletion();
  const [nameValue, setNameValue] = useState<string>(userInfo?.nickName || '');
  const [nameError, setNameError] = useState<ErrorType>(INIT_HAS_ERROR);
  const setUserInfo = useSetUserInfo();
  const [avatar, setAvatar] = useState<string>(userInfo?.avatar || '');

  const showChat = useIsChatShow();

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

  const onNameChange = useCallback((value: string) => {
    setNameValue(value);
    setNameError({ ...INIT_HAS_ERROR });
  }, []);

  const onSave = useCallback(async () => {
    const _nameValue = nameValue.trim();
    if (_nameValue === '') {
      setNameValue('');
      setNameError({
        isError: true,
        errorMsg: t('Please Enter Wallet Name'),
      });
      return;
    }
    if (!isValidCAWalletName(_nameValue)) {
      setNameError({ ...INIT_HAS_ERROR, errorMsg: t('3-16 characters, only a-z, A-Z, 0-9 and "_" allowed') });
      return;
    }
    // if (_nameValue === walletName) {
    //   CommonToast.success(t('Saved Successful'), undefined, 'bottom');
    //   navigationService.goBack();
    //   return;
    // }
    Loading.show();
    try {
      await sleep(500); // adjust large size on android
      const s3Url = await uploadRef.current?.uploadPhoto();
      setAvatar(s3Url || userInfo?.avatar || '');
      await setUserInfo({ nickName: _nameValue, avatar: s3Url || userInfo?.avatar || '' });
      navigationService.goBack();
      CommonToast.success(t('Saved Successful'), undefined, 'bottom');
    } catch (error: any) {
      console.log('setWalletName: error', error);
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [nameValue, t, setUserInfo, userInfo?.avatar]);

  return (
    <PageContainer titleDom={t('My Profile')} safeAreaColor={['blue', 'gray']} containerStyles={pageStyles.pageWrap}>
      <View style={pageStyles.pageContainer}>
        <View>
          {showChat ? (
            <>
              <ProfileHeaderSection name={userInfo?.nickName || ''} avatarUrl={userInfo?.avatar || ''} />
              <ProfilePortkeyIDSection showQrCodeButton id={userInfo?.userId || ''} />
              <ProfileAddressSection isMySelf addressList={caInfoList} />
            </>
          ) : (
            <>
              <Touchable style={GStyles.center} onPress={() => uploadRef.current?.selectPhoto()}>
                <ImageWithUploadFunc
                  avatarSize={pTd(80)}
                  ref={uploadRef}
                  title={userInfo?.nickName || ''}
                  imageUrl={avatar || ''}
                />
                <TextL style={[FontStyles.font4, pageStyles.setButton]}>Set New Photo</TextL>
              </Touchable>
              <FormItem title={'Wallet Name'}>
                <CommonInput
                  type="general"
                  spellCheck={false}
                  autoCorrect={false}
                  value={nameValue}
                  theme={'white-bg'}
                  placeholder={t('Enter Wallet Name')}
                  onChangeText={onNameChange}
                  maxLength={16}
                  errorMessage={nameError.errorMsg}
                />
              </FormItem>
            </>
          )}
        </View>
        <CommonButton
          title={showChat ? 'Edit' : 'Save'}
          type="solid"
          onPress={() => {
            if (showChat) {
              navigationService.navigate('EditWalletName');
            } else {
              onSave();
            }
          }}
        />
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
