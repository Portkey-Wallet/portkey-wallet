import React, { useCallback, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { Text, View, StyleSheet } from 'react-native';
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
import { makeStyles, useTheme } from '@rneui/themed';
import Svg from 'components/Svg';
interface RouterParams {
  mail?: string;
}

const SecondaryMailboxEdit: React.FC = () => {
  const pageStyles = getStyles();
  const { theme } = useTheme();
  const { mail } = useRouterParams<RouterParams>();
  const { errorMessage, email, setErrorMessage, setEmail, checkEmailValid } = useSecondaryMail(mail);
  const [loading, setLoading] = useState(false);
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
      titleDom={'Backup Email'}
      safeAreaColor={['black']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        <View>
          <CommonInput
            labelStyle={pageStyles.label}
            label={'Add a backup email address'}
            inputContainerStyle={pageStyles.inputContainer}
            type="general"
            keyboardType={'email-address'}
            value={email}
            defaultValue={mail}
            placeholder="Enter email"
            placeholderTextColor={theme.colors.textBase3}
            onChangeText={onMailInput}
            errorMessage={errorMessage}
            autoFocus
            onFocus={() => {
              setErrorMessage('');
            }}
          />
        </View>
        <View style={pageStyles.fromExchangeTipWrap}>
          <Svg icon="warning" size={pTd(22)} color={theme.colors.textBrand3} />
          <TextL
            style={
              pageStyles.fromExchangeTipText
            }>{`Notifications for authorizing or signing transactions will be sent to your guardian's email. If unavailable, they'll go to your backup email.`}</TextL>
        </View>
      </View>
      <CommonButton
        type="primary"
        loading={loading}
        disabled={!email}
        onPress={async () => {
          if (checkEmailValid()) {
            try {
              setLoading(true);
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
              setLoading(false);
            }
          }
        }}>
        Verify email
      </CommonButton>
    </PageContainer>
  );
};
const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(16),
  },
  label: {
    color: theme.colors.textNeutral2,
  },
  inputContainer: {
    borderColor: theme.colors.textBase3,
    borderLeftWidth: pTd(1),
    borderRightWidth: pTd(1),
    borderTopWidth: pTd(1),
    borderBottomWidth: pTd(1),
  },
  fromExchangeTipWrap: {
    backgroundColor: theme.colors.bgBase1,
    borderWidth: pTd(1),
    borderColor: theme.colors.textBase3,
    borderRadius: pTd(16),
    padding: pTd(16),
    flexDirection: 'row',
  },
  fromExchangeTipText: {
    flex: 1,
    marginLeft: pTd(12),
    color: theme.colors.textBase2,
    lineHeight: pTd(20),
    fontSize: pTd(14),
  },
}));

export default SecondaryMailboxEdit;
