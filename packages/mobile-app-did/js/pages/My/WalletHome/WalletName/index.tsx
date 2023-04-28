import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useState } from 'react';
import { pageStyles } from './style';
import CommonButton from 'components/CommonButton';
import CommonInput from 'components/CommonInput';
import { ErrorType } from 'types/common';
import { INIT_HAS_ERROR } from 'constants/common';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import { useSetWalletName, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Loading from 'components/Loading';

const WalletName: React.FC = () => {
  const { t } = useLanguage();
  const { walletName } = useWallet();
  const [nameValue, setNameValue] = useState<string>(walletName);
  const [nameError, setNameError] = useState<ErrorType>(INIT_HAS_ERROR);
  const setWalletName = useSetWalletName();

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
      titleDom={t('Wallet Name')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
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

      <CommonButton disabled={nameValue === ''} type="solid" onPress={onSave}>
        {t('Save')}
      </CommonButton>
    </PageContainer>
  );
};
export default WalletName;
