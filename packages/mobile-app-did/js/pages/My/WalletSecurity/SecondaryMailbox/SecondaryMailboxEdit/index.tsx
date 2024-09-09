import React, { useCallback } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, Text, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { TextL } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import CommonInput from 'components/CommonInput';
import ActionSheet from 'components/ActionSheet';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { useSecondaryMail } from '@portkey-wallet/hooks/hooks-ca/useSecondaryMail';
import { verification } from 'utils/api';

interface RouterParams {
  mail?: string;
}

const SecondaryMailboxEdit: React.FC = () => {
  const { mail } = useRouterParams<RouterParams>();
  const { errorMessage, email, setErrorMessage, setEmail, checkEmailValid } = useSecondaryMail(mail);
  const sendSecondaryEmailCode = useCallback(async () => {
    const res = await verification.sendSecondaryVerificationCode({
      params: {
        secondaryEmail: email,
      },
    });
    return res;
  }, [email]);
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
