import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, Text, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { ApprovalType } from '@portkey-wallet/types/verifier';
import { TextL, TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import CommonInput from 'components/CommonInput';
import CommonSwitch from 'components/CommonSwitch';
import { INIT_HAS_ERROR, INIT_NONE_ERROR, ErrorType } from '@portkey-wallet/constants/constants-ca/common';
import { isValidInteger } from '@portkey-wallet/utils/reg';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { checkEmail } from '@portkey-wallet/utils/check';
import ActionSheet from 'components/ActionSheet';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { useSecondaryMail } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';

interface RouterParams {
  mail?: string;
}

const SecondaryMailboxEdit: React.FC = () => {
  const { mail } = useRouterParams<RouterParams>();
  const { errorMessage, email, setErrorMessage, setEmail, sendSecondaryEmailCode, checkEmailValid } =
    useSecondaryMail(mail);
  const onMailInput = useCallback(
    (value: string) => {
      setErrorMessage('');
      setEmail(value);
    },
    [setEmail, setErrorMessage],
  );
  return (
    <PageContainer
      titleDom={'Set up Backup Mailbox'}
      safeAreaColor={['white', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        <CommonInput
          label={'Backup Mailbox'}
          theme="white-bg"
          type="general"
          keyboardType={'email-address'}
          value={email}
          defaultValue={mail}
          placeholder="Enter email"
          onChangeText={onMailInput}
          errorMessage={errorMessage}
          autoFocus
          onFocus={() => {
            setErrorMessage('');
          }}
        />
      </View>
      <CommonButton
        type="primary"
        onPress={() => {
          if (checkEmailValid()) {
            ActionSheet.alert({
              title2: (
                <Text>
                  <TextL>{`We will send a verification code to `}</TextL>
                  <TextL style={FontStyles.weight500}>{email}</TextL>
                  <TextL>{` to verify your email address`}</TextL>
                </Text>
              ),
              buttons: [
                {
                  title: 'Cancel',
                  type: 'outline',
                },
                {
                  title: 'Confirm',
                  onPress: async () => {
                    try {
                      Loading.show();
                      const res = await sendSecondaryEmailCode();
                      if (res.verifierSessionId) {
                        navigationService.navigate('VerifierEmail', {
                          verifierSessionId: res?.verifierSessionId,
                          email,
                        });
                      } else {
                        throw new Error('send fail');
                      }
                    } catch (error) {
                      CommonToast.failError(error);
                    } finally {
                      Loading.hide();
                    }
                  },
                },
              ],
            });
          }
        }}>
        Save
      </CommonButton>
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(24, 20, 18),
  },
  switchWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: pTd(16),
    backgroundColor: defaultColors.bg1,
    marginBottom: pTd(24),
    height: pTd(56),
    alignItems: 'center',
    borderRadius: pTd(6),
  },
  tipsWrap: {
    lineHeight: pTd(20),
    color: defaultColors.font3,
  },
});

export default SecondaryMailboxEdit;
