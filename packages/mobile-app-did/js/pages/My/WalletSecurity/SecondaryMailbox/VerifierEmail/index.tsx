import { DIGIT_CODE } from '@portkey-wallet/constants/misc';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import VerifierCountdown, { VerifierCountdownInterface } from 'components/VerifierCountdown';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { VerificationType, OperationTypeEnum, VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
// import GuardianItem from '../../components/GuardianItem';
import { FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import myEvents from 'utils/deviceEvent';
import { useCurrentWalletInfo, useOriginChainId, useVerifyManagerAddress } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { LoginType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { GuardiansApproved, GuardiansStatusItem } from '../types';
import { verification } from 'utils/api';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useOnRequestOrSetPin } from 'hooks/login';
import { usePin } from 'hooks/store';
import {
  VERIFICATION_TO_APPROVAL_MAP,
  VERIFICATION_TO_OPERATION_MAP,
} from '@portkey-wallet/constants/constants-ca/verifier';
import { ChainId } from '@portkey-wallet/types';
import { CreateAddressLoading, VERIFY_INVALID_TIME } from '@portkey-wallet/constants/constants-ca/wallet';
import { handleGuardiansApproved } from 'utils/login';
import { checkVerifierIsInvalidCode } from '@portkey-wallet/utils/guardian';
import { pTd } from 'utils/unit';
import { useErrorMessage } from '@portkey-wallet/hooks/hooks-ca/misc';
import { useLatestRef } from '@portkey-wallet/hooks';
import { deleteLoginAccount } from '@portkey-wallet/utils/deleteAccount';
import { useGetCurrentCAContract } from 'hooks/contract';
import useLogOut from 'hooks/useLogOut';
import { String } from 'lodash';
import GuardianItem from 'pages/Guardian/components/GuardianItem';
import Svg from 'components/Svg';
import { AuthTypes } from 'constants/guardian';
import { LOGIN_GUARDIAN_TYPE_ICON } from 'constants/misc';
import { defaultColors } from 'assets/theme';
import { request } from '@portkey-wallet/api/api-did';

type RouterParams = {
  verifierSessionId: string;
  email: string;
};
function TipText({ email }: { email?: string }) {
  const [first, last] = useMemo(() => {
    return [`A ${DIGIT_CODE.length}-digit code was sent to `, ` Enter it within ${DIGIT_CODE.expiration} minutes`];
  }, []);
  return (
    <TextM style={[FontStyles.font3, GStyles.marginTop(16), GStyles.marginBottom(50)]}>
      {first}
      <Text style={FontStyles.font4}>{email}</Text>
      {last}
    </TextM>
  );
}
function EmailTitle({ email }: { email?: string }) {
  const renderGuardianAccount = useCallback(() => {
    return (
      <TextM numberOfLines={2} style={[styles.nameStyle, GStyles.flex1]}>
        {email}
      </TextM>
    );
  }, [email]);
  return (
    <View style={[styles.itemRow]}>
      <View style={[GStyles.flexRowWrap, GStyles.itemCenter, GStyles.flex1]}>
        <View style={[GStyles.center, styles.loginTypeIconWrap]}>
          <Svg icon={LOGIN_GUARDIAN_TYPE_ICON[LoginType.Email]} size={pTd(18)} />
        </View>
        {renderGuardianAccount()}
      </View>
    </View>
  );
}
export default function VerifierEmail() {
  const { verifierSessionId, email } = useRouterParams<RouterParams>();
  const verifierSessionIdRef = useRef<string>(verifierSessionId);
  const countdown = useRef<VerifierCountdownInterface>();
  useEffectOnce(() => {
    countdown.current?.resetTime(60);
  });
  const digitInput = useRef<DigitInputInterface>();

  const { error: codeError, setError: setCodeError } = useErrorMessage();

  const onFinish = useLockCallback(
    async (code: string) => {
      digitInput.current?.lockInput();
      const loadingKey = Loading.show();
      try {
        const rst = await request.security.secondaryEmailCodeCheck({
          params: {
            verificationCode: code,
            verifierSessionId: verifierSessionIdRef.current,
          },
        });
        if (rst.verifiedResult) {
          // const setSecondaryEmailRst = await request.security.setSecondaryEmail({
          //   params: {
          //     verifierSessionId: verifierSessionIdRef.current,
          //   },
          // });
          CommonToast.success('Successfully');
          myEvents.updateSecondaryEmail.emit({ email });
          navigationService.navigate('WalletSecurity');
          // if (setSecondaryEmailRst.setResult) {
          //   CommonToast.success('Set Secondary Email Successfully');
          //   myEvents.updateSecondaryEmail.emit({ email });
          //   navigationService.navigate('WalletSecurity');
          // }
        } else {
          throw 'Invalid code';
        }
      } catch (error) {
        const _isInvalidCode = checkVerifierIsInvalidCode(error);
        if (_isInvalidCode) {
          setCodeError('', VERIFY_INVALID_TIME);
        } else {
          CommonToast.failError(error, 'Verify Fail');
        }

        digitInput.current?.reset();
        Loading.hide(loadingKey);
      } finally {
        digitInput.current?.unLockInput();
        Loading.hide();
      }
    },
    [email, setCodeError],
  );

  const resendCode = useLockCallback(async () => {
    digitInput.current?.lockInput();
    Loading.show(undefined, true);
    try {
      const req = await verification.sendSecondaryVerificationCode({
        params: {
          secondaryEmail: email,
        },
      });
      if (req.verifierSessionId) {
        verifierSessionIdRef.current = req.verifierSessionId;
        countdown.current?.resetTime(60);
      }
    } catch (error) {
      CommonToast.failError(error, 'Verify Fail');
    }
    digitInput.current?.unLockInput();
    digitInput.current?.reset();
    Loading.hide();
  }, [email]);

  return (
    <PageContainer type="leftBack" titleDom containerStyles={styles.containerStyles}>
      <EmailTitle email={email} />
      <TipText email={email} />
      <DigitInput
        ref={digitInput}
        onChangeText={() => {
          setCodeError();
        }}
        onFinish={onFinish}
        maxLength={DIGIT_CODE.length}
        isError={codeError.isError}
      />
      <VerifierCountdown
        isInvalidCode={codeError.isError}
        style={GStyles.marginTop(24)}
        onResend={resendCode}
        ref={countdown}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    paddingTop: pTd(8),
    paddingHorizontal: pTd(20),
  },
  nameStyle: {
    marginLeft: pTd(12),
  },
  itemRow: {
    height: pTd(88),
    marginTop: pTd(8),
    paddingBottom: pTd(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginTypeIconWrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    backgroundColor: defaultColors.bg6,
    width: pTd(32),
    height: pTd(32),
    borderRadius: pTd(16),
  },
});
