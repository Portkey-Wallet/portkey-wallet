import CommonButton from 'components/CommonButton';
import { TextL, TextM } from 'components/CommonText';
import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pageStyles } from './style';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import CommonSwitch from 'components/CommonSwitch';
import ActionSheet from 'components/ActionSheet';
import { useGuardiansInfo } from 'hooks/store';
import { useGetGuardiansInfo } from 'hooks/guardian';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { VerificationType, OperationTypeEnum, ApprovalType } from '@portkey-wallet/types/verifier';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { VerifierImage } from 'pages/Guardian/components/VerifierImage';
import { verification } from 'utils/api';
import { RouteProp, useRoute } from '@react-navigation/native';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import fonts from 'assets/theme/fonts';
import GuardianAccountItem from '../components/GuardianAccountItem';
import Divider from 'components/Divider';
import {
  AppleAuthentication,
  GoogleAuthentication,
  useAppleAuthentication,
  useGoogleAuthentication,
  useVerifyToken,
} from 'hooks/authentication';
import { checkIsLastLoginAccount } from '@portkey-wallet/utils/guardian';

type RouterParams = {
  guardian?: UserGuardianItem;
};

const THIRD_PART_LOGIN_TYPE = [LoginType.Apple, LoginType.Google];

export default function GuardianDetail() {
  const {
    params: { guardian },
  } = useRoute<RouteProp<{ params: RouterParams }>>();
  const getGuardiansInfo = useGetGuardiansInfo();
  const { userGuardiansList } = useGuardiansInfo();
  const { appleSign } = useAppleAuthentication();
  const { googleSign } = useGoogleAuthentication();
  const originChainId = useOriginChainId();

  // Email & Phone
  const sendLoginAccountVerify = useCallback(
    async (currentGuardian: UserGuardianItem, isLoginAccount: boolean) => {
      try {
        Loading.show();
        const req = await verification.sendVerificationCode({
          params: {
            type: LoginType[currentGuardian.guardianType],
            guardianIdentifier: currentGuardian.guardianAccount,
            verifierId: currentGuardian.verifier?.id,
            chainId: originChainId,
            operationType: isLoginAccount ? OperationTypeEnum.setLoginAccount : OperationTypeEnum.unsetLoginAccount,
          },
        });
        if (req.verifierSessionId) {
          navigationService.navigate('VerifierDetails', {
            guardianItem: currentGuardian,
            requestCodeResult: {
              verifierSessionId: req.verifierSessionId,
            },
            verificationType: isLoginAccount ? VerificationType.setLoginAccount : VerificationType.unsetLoginAccount,
          });
        } else {
          console.log('send fail');
        }
      } catch (error) {
        CommonToast.failError(error);
      }
      Loading.hide();
    },
    [originChainId],
  );

  // Email & Phone
  const setCommonLoginAccount = useCallback(
    async (currentGuardian: UserGuardianItem, isLoginAccount: boolean) => {
      ActionSheet.alert({
        title2: (
          <Text>
            <TextL>{`${currentGuardian.verifier?.name} will send a verification code to `}</TextL>
            <TextL style={fonts.mediumFont}>{currentGuardian.guardianAccount}</TextL>
            <TextL>{` to verify your ${
              currentGuardian.guardianType === LoginType.Phone ? 'phone number' : 'email address'
            }.`}</TextL>
          </Text>
        ),
        buttons: [
          {
            title: 'Cancel',
            type: 'outline',
          },
          {
            title: 'Confirm',
            onPress: () => {
              sendLoginAccountVerify(currentGuardian, isLoginAccount);
            },
          },
        ],
      });
    },
    [sendLoginAccountVerify],
  );

  const verifyToken = useVerifyToken();
  const setThirdPartyLoginAccount = useCallback(
    async (currentGuardian: UserGuardianItem, isLoginAccount: boolean) => {
      Loading.show();
      try {
        const userInfo = await (currentGuardian.guardianType === LoginType.Apple ? appleSign : googleSign)();
        const guardianAccount = userInfo.user.id;
        if (guardianAccount !== currentGuardian.guardianAccount)
          throw new Error('Account does not match your guardian');
        // CommonToast.success('Verified Successfully');
        let accessToken = '';
        if (currentGuardian.guardianType === LoginType.Apple) {
          accessToken = (userInfo as AppleAuthentication).identityToken;
        } else {
          accessToken = (userInfo as GoogleAuthentication).accessToken;
        }
        const rst = await verifyToken(currentGuardian.guardianType, {
          accessToken,
          id: guardianAccount,
          verifierId: currentGuardian.verifier?.id,
          chainId: originChainId,
          operationType: isLoginAccount ? OperationTypeEnum.setLoginAccount : OperationTypeEnum.unsetLoginAccount,
        });

        navigationService.navigate('GuardianApproval', {
          approvalType: isLoginAccount ? ApprovalType.setLoginAccount : ApprovalType.unsetLoginAccount,
          guardianItem: currentGuardian,
          verifierInfo: {
            ...rst,
            verifierId: currentGuardian.verifier?.id,
          },
          verifiedTime: Date.now(),
          authenticationInfo: { [guardianAccount]: accessToken },
        });
      } catch (error) {
        CommonToast.failError(error);
      }
      Loading.hide();
    },
    [appleSign, googleSign, originChainId, verifyToken],
  );

  const onLoginAccountChange = useCallback(
    async (value: boolean) => {
      if (guardian === undefined || userGuardiansList === undefined) return;

      if (!value) {
        const isLastLoginAccount = checkIsLastLoginAccount(userGuardiansList, guardian);
        if (isLastLoginAccount) {
          ActionSheet.alert({
            title2: 'This guardian is the only login account and cannot be turned off',
            buttons: [
              {
                title: 'Close',
              },
            ],
          });
          return;
        }

        if (THIRD_PART_LOGIN_TYPE.includes(guardian.guardianType)) {
          setThirdPartyLoginAccount(guardian, false);
        } else {
          setCommonLoginAccount(guardian, false);
        }

        return;
      }

      const loginIndex = userGuardiansList.findIndex(
        item =>
          item.isLoginAccount &&
          item.guardianType === guardian.guardianType &&
          item.guardianAccount === guardian.guardianAccount &&
          item.verifier?.id !== guardian.verifier?.id,
      );
      if (loginIndex === -1) {
        Loading.show();
        try {
          const guardiansInfo = await getGuardiansInfo({ guardianIdentifier: guardian.guardianAccount });
          if (guardiansInfo?.guardianList?.guardians?.length) {
            throw { code: '20004' };
          }
        } catch (error: any) {
          if (error.code === '20004') {
            Loading.hide();
            ActionSheet.alert({
              title2: 'This account address is already a login account and cannot be used',
              buttons: [
                {
                  title: 'Close',
                },
              ],
            });
            return;
          }
          if (error.code !== '3002') {
            CommonToast.fail('Setup failed');
            return;
          }
        } finally {
          Loading.hide();
        }
      }

      if (THIRD_PART_LOGIN_TYPE.includes(guardian.guardianType)) {
        setThirdPartyLoginAccount(guardian, true);
      } else {
        setCommonLoginAccount(guardian, true);
      }
    },
    [getGuardiansInfo, guardian, setCommonLoginAccount, setThirdPartyLoginAccount, userGuardiansList],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={'Guardians'}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.contentWrap}>
        <View style={pageStyles.guardianInfoWrap}>
          <GuardianAccountItem guardian={guardian} />
          <Divider style={pageStyles.dividerStyle} />
          <View style={pageStyles.verifierInfoWrap}>
            <VerifierImage
              style={pageStyles.verifierImageStyle}
              size={pTd(28)}
              label={guardian?.verifier?.name}
              uri={guardian?.verifier?.imageUrl}
            />
            <TextL>{guardian?.verifier?.name || ''}</TextL>
          </View>
        </View>

        <View style={pageStyles.loginSwitchWrap}>
          <TextM>{'Login account'}</TextM>
          <CommonSwitch
            value={guardian === undefined ? false : guardian.isLoginAccount}
            onValueChange={onLoginAccountChange}
          />
        </View>

        <TextM style={pageStyles.tips}>{'The login account will be able to log in and control all your assets'}</TextM>
      </View>
      {userGuardiansList && userGuardiansList.length > 1 && (
        <CommonButton
          type="primary"
          onPress={() => {
            navigationService.navigate('GuardianEdit', {
              guardian: JSON.parse(JSON.stringify(guardian)),
              isEdit: true,
            });
          }}>
          {'Edit'}
        </CommonButton>
      )}
    </PageContainer>
  );
}
