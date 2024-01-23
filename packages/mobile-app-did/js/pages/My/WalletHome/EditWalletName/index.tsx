import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import CommonButton from 'components/CommonButton';
import CommonInput from 'components/CommonInput';
import { INIT_HAS_ERROR, ErrorType } from '@portkey-wallet/constants/constants-ca/common';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import { useCurrentCaInfo, useSetUserInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Loading from 'components/Loading';
import FormItem from 'components/FormItem';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { defaultColors } from 'assets/theme';
import gStyles from 'assets/theme/GStyles';
import ProfilePortkeyIDSection from 'pages/My/components/ProfileIDSection';
import ProfileAddressSection from 'pages/My/components/ProfileAddressSection';
import { ChainId } from '@portkey/provider-types';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { useInputFocus } from 'hooks/useInputFocus';
import ImageWithUploadFunc, { ImageWithUploadFuncInstance } from 'components/ImageWithUploadFunc';
import Touchable from 'components/Touchable';
import { TextL } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { sleep } from '@portkey-wallet/utils';

const EditWalletName: React.FC = () => {
  const iptRef = useRef<TextInput>();
  useInputFocus(iptRef);
  const uploadRef = useRef<ImageWithUploadFuncInstance>(null);

  const { t } = useLanguage();
  const { userInfo } = useWallet();
  const [nameValue, setNameValue] = useState<string>(userInfo?.nickName || '');
  const [avatar, setAvatar] = useState<string>(userInfo?.avatar || '');

  const [nameError, setNameError] = useState<ErrorType>(INIT_HAS_ERROR);
  const setUserInfo = useSetUserInfo();
  const caInfo = useCurrentCaInfo();

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
    Loading.show();
    try {
      await sleep(500); // adjust large size on android
      const s3Url = await uploadRef.current?.uploadPhoto();
      if (s3Url) setAvatar(s3Url);

      await setUserInfo({ nickName: _nameValue, avatar: s3Url || userInfo?.avatar });
      navigationService.goBack();
      CommonToast.success(t('Saved Successful'));
    } catch (error: any) {
      console.log('setUserInfo: error', error);
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [nameValue, t, setUserInfo, userInfo?.avatar]);

  return (
    <PageContainer
      titleDom={t('Edit')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <ScrollView>
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
            ref={iptRef}
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
        <ProfilePortkeyIDSection noMarginTop disable id={userInfo?.userId || ''} />
        <ProfileAddressSection isMySelf disable addressList={caInfoList} />
      </ScrollView>

      <CommonButton disabled={nameValue === ''} type="solid" onPress={onSave}>
        {t('Save')}
      </CommonButton>
    </PageContainer>
  );
};
export default EditWalletName;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...gStyles.paddingArg(24, 20, 18),
  },
  setButton: {
    marginTop: pTd(8),
    marginBottom: pTd(24),
  },
});
