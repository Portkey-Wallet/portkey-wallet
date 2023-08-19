import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo, useState } from 'react';
import CommonButton from 'components/CommonButton';
import CommonInput from 'components/CommonInput';
import { ErrorType } from 'types/common';
import { INIT_HAS_ERROR } from 'constants/common';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import { useCurrentCaInfo, useSetWalletName, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Loading from 'components/Loading';
import FormItem from 'components/FormItem';
import { ScrollView, StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import gStyles from 'assets/theme/GStyles';
import ProfilePortkeyIDSection from 'pages/My/components/ProfilePortkeyIDSection';
import ProfileAddressSection from 'pages/My/components/ProfileAddressSection';
import { ChainId } from '@portkey/provider-types';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';

const EditWalletName: React.FC = () => {
  const { t } = useLanguage();
  const { walletName, userId } = useWallet();
  const [nameValue, setNameValue] = useState<string>(walletName);
  const [nameError, setNameError] = useState<ErrorType>(INIT_HAS_ERROR);
  const setWalletName = useSetWalletName();
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
    // if (_nameValue === walletName) {
    //   CommonToast.success(t('Saved Successful'), undefined, 'bottom');
    //   navigationService.goBack();
    //   return;
    // }
    Loading.show();
    try {
      await setWalletName(_nameValue);

      navigationService.goBack();
      CommonToast.success(t('Saved Successful'), undefined, 'bottom');
    } catch (error: any) {
      CommonToast.failError(error.error);
      console.log('setWalletName: error', error);
    }
    Loading.hide();
  }, [nameValue, setWalletName, t]);

  return (
    <PageContainer
      titleDom={t('Edit')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <ScrollView>
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
        <ProfilePortkeyIDSection noMarginTop disable portkeyID={userId || ''} />
        <ProfileAddressSection disable addressList={caInfoList} />
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
    ...gStyles.paddingArg(32, 20, 18),
  },
});
