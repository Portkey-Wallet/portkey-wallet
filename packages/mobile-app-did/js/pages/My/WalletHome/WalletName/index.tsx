import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo, useState } from 'react';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { View, StyleSheet } from 'react-native';
import { useCurrentCaInfo, useSetWalletName, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import ProfilePortkeyIDSection from 'pages/My/components/ProfilePortkeyIDSection';
import ProfileHeaderSection from 'pages/My/components/ProfileHeaderSection';
import ProfileAddressSection from 'pages/My/components/ProfileAddressSection';

import { defaultColors } from 'assets/theme';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { windowHeight } from '@portkey-wallet/utils/mobile/device';
import { headerHeight } from 'components/CustomHeader/style/index.style';
import { FontStyles } from 'assets/theme/styles';
import { useIsShowDeletion } from 'hooks/account';

import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { INIT_HAS_ERROR } from 'constants/common';
import FormItem from 'components/FormItem';
import CommonInput from 'components/CommonInput';
import { ErrorType } from 'types/common';
const PageHeight = windowHeight - headerHeight;

const WalletName: React.FC = () => {
  const { t } = useLanguage();
  const { walletName, userId } = useWallet();
  const caInfo = useCurrentCaInfo();
  const showDeletion = useIsShowDeletion();
  const [nameValue, setNameValue] = useState<string>(walletName);
  const [nameError, setNameError] = useState<ErrorType>(INIT_HAS_ERROR);
  const setWalletName = useSetWalletName();

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
    <PageContainer titleDom={t('My DID')} safeAreaColor={['blue', 'gray']} containerStyles={pageStyles.pageWrap}>
      <View style={pageStyles.pageContainer}>
        <View>
          {showChat ? (
            <>
              <ProfileHeaderSection name={walletName} />
              <ProfilePortkeyIDSection portkeyID={userId || ''} />
              <ProfileAddressSection isMySelf addressList={caInfoList} />
            </>
          ) : (
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
    paddingBottom: 68,
    height: PageHeight,
    justifyContent: 'space-between',
  },
});
