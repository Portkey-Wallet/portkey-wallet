import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useState } from 'react';
import CommonButton from 'components/CommonButton';
import CommonInput from 'components/CommonInput';
import { ErrorType } from 'types/common';
import { INIT_HAS_ERROR } from 'constants/common';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import { useSetWalletName, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Loading from 'components/Loading';
import FormItem from 'components/FormItem';
import { View } from 'react-native';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import gStyles from 'assets/theme/GStyles';

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

      <FormItem title={'Portkey ID'}>
        <View>
          <TextM>xxxxxx-yyyy-zzzzz</TextM>
          <Touchable>
            <Svg icon="copy" size={pTd(20)} />
          </Touchable>
        </View>
      </FormItem>
      <FormItem title={'DID'}>
        <View>
          <Svg icon="elf-icon" />
          <TextM>xxxxxx-yyyy-zzzzz</TextM>
          <Touchable>
            <Svg icon="copy" size={pTd(20)} />
          </Touchable>
        </View>
      </FormItem>
      <CommonButton disabled={nameValue === ''} type="solid" onPress={onSave}>
        {t('Save')}
      </CommonButton>
    </PageContainer>
  );
};
export default WalletName;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    justifyContent: 'space-between',
    ...gStyles.paddingArg(32, 20, 18),
  },
});
