import CommonButton from 'components/CommonButton';
import { TextL, TextM } from 'components/CommonText';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import { pageStyles } from './style';
import { useLanguage } from 'i18n/hooks';
import CommonSwitch from 'components/CommonSwitch';
import ActionSheet from 'components/ActionSheet';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { VerificationType, OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { VerifierImage } from 'pages/Guardian/components/VerifierImage';
import { cancelLoginAccount, setLoginAccount } from 'utils/guardian';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import fonts from 'assets/theme/fonts';
import GuardianAccountItem from '../components/GuardianAccountItem';
import Divider from 'components/Divider';
import { useAppleAuthentication, useGoogleAuthentication } from 'model/hooks/authentication';
import { GuardianConfig } from 'model/verify/guardian';
import { PortkeyConfig } from 'global/constants';
import useEffectOnce from 'hooks/useEffectOnce';
import { getCAContractInstance, getVerifierData } from 'model/contract/handler';
import { guardianEnumToTypeStr, guardianTypeStrToEnum, isRecaptchaOpen, parseGuardianInfo } from 'model/global';
import { AccountOriginalType } from 'model/verify/core';
import { getUnlockedWallet } from 'model/wallet';
import { NetworkController } from 'network/controller';
import { ModifyGuardianProps, checkIsTheLastLoginGuardian } from '../GuardianManage/ModifyGuardian';
import { handlePhoneOrEmailGuardianVerify } from 'model/verify/entry/hooks';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';
import { UserGuardianItem } from 'packages/store/store-ca/guardians/type';

export default function GuardianDetail(config: { info: string }) {
  const { t } = useLanguage();
  const [editGuardian, setEditGuardian] = useState<GuardianConfig>();
  const [guardian, setOriginalGuardianItem] = useState<UserGuardianItem>();
  const [userGuardiansList, setUserGuardiansList] = useState<Array<GuardianConfig>>([]);

  const { appleSign } = useAppleAuthentication();
  const { googleSign } = useGoogleAuthentication();

  const { navigateTo, onFinish } = useBaseContainer({
    entryName: PortkeyEntries.GUARDIAN_DETAIL_ENTRY,
  });

  const changeLoginAccountStatus = useCallback(
    (newStatus: boolean) => {
      if (guardian) {
        setOriginalGuardianItem({ ...guardian, isLoginAccount: newStatus });
      }
      if (editGuardian) {
        setEditGuardian({ ...editGuardian, isLoginGuardian: newStatus });
      }
    },
    [editGuardian, guardian],
  );

  useEffectOnce(async () => {
    Loading.show();
    const { particularGuardianInfo, originalGuardianItem } = JSON.parse(config.info) as ModifyGuardianProps;
    particularGuardianInfo && setEditGuardian(particularGuardianInfo);
    originalGuardianItem && setOriginalGuardianItem(originalGuardianItem);
    const {
      caInfo: { caHash },
    } = await getUnlockedWallet();
    const chainId = await PortkeyConfig.currChainId();
    const guardiansInfo = await NetworkController.getGuardianInfo('', caHash);
    const cachedVerifierData = Object.values((await getVerifierData()).data?.verifierServers ?? {});
    const parsedGuardians = guardiansInfo?.guardianList?.guardians?.map(it => {
      return parseGuardianInfo(
        it,
        chainId,
        cachedVerifierData,
        undefined,
        undefined,
        AccountOriginalType.Email,
        OperationTypeEnum.editGuardian,
      );
    });
    parsedGuardians && setUserGuardiansList(parsedGuardians);
    Loading.hide();
  });

  const onCancelLoginAccount = useCallback(async () => {
    if (!guardian) return;
    Loading.show();
    try {
      Loading.show();
      const {
        address: managerAddress,
        caInfo: { caHash },
      } = await getUnlockedWallet();
      const identifierHash = userGuardiansList?.find(
        item => item.sendVerifyCodeParams.guardianIdentifier === guardian.guardianAccount,
      )?.identifierHash;
      if (identifierHash) guardian.identifierHash = identifierHash;
      console.log('identifierHash', userGuardiansList);
      const caContract = await getCAContractInstance();
      const req = await cancelLoginAccount(caContract, managerAddress, caHash, guardian);
      if (req && !req.error) {
        changeLoginAccountStatus(false);
        CommonToast.success('Cancel login account successfully');
      } else {
        CommonToast.fail(req?.error?.message || '');
      }
      Loading.hide();
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [changeLoginAccountStatus, guardian, userGuardiansList]);

  const onSetLoginAccount = useCallback(async () => {
    try {
      if (!guardian) return;
      Loading.show();
      const {
        address: managerAddress,
        caInfo: { caHash },
      } = await getUnlockedWallet();
      const identifierHash = userGuardiansList?.find(
        item => item.sendVerifyCodeParams.guardianIdentifier === guardian.guardianAccount,
      )?.identifierHash;
      if (identifierHash) guardian.identifierHash = identifierHash;
      const caContract = await getCAContractInstance();
      const req = await setLoginAccount(caContract, managerAddress, caHash, guardian);
      if (req && !req.error) {
        changeLoginAccountStatus(true);
        CommonToast.success('Set login account successfully');
      } else {
        CommonToast.fail(req?.error?.message || '');
      }
      Loading.hide();
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [changeLoginAccountStatus, guardian, userGuardiansList]);

  const sendLoginAccountVerify = useCallback(async () => {
    if (!guardian) return;
    try {
      const originChainId = await PortkeyConfig.currChainId();
      Loading.show();
      const needRecaptcha = await isRecaptchaOpen(OperationTypeEnum.setLoginAccount);
      let token: string | undefined;
      if (needRecaptcha) {
        token = (await verifyHumanMachine('en')) as string;
      }
      const req = await NetworkController.sendVerifyCode(
        {
          type: guardianEnumToTypeStr(guardian.guardianType),
          guardianIdentifier: guardian.guardianAccount || '',
          verifierId: guardian.verifier?.id || '',
          chainId: originChainId,
          operationType: OperationTypeEnum.setLoginAccount,
        },
        {
          reCaptchaToken: token,
        },
      );
      if (req.verifierSessionId) {
        const guardianVerifyResult = await handlePhoneOrEmailGuardianVerify({
          verificationType: VerificationType.addGuardian,
          accountIdentifier: guardian.guardianAccount,
          accountOriginalType: AccountOriginalType.Email,
          deliveredGuardianInfo: JSON.stringify(
            Object.assign({}, editGuardian, {
              alreadySent: true,
              verifySessionId: req.verifierSessionId,
            } as Partial<GuardianConfig>),
          ),
          operationType: OperationTypeEnum.setLoginAccount,
        });
        if (!guardianVerifyResult?.verifiedData) throw new Error('verify fail');
        await onSetLoginAccount();
      } else {
        console.log('send fail');
      }
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [editGuardian, guardian, onSetLoginAccount]);

  const onLoginAccountChange = useCallback(
    async (value: boolean) => {
      if (!guardian || !editGuardian || userGuardiansList === undefined) return;

      if (!value) {
        const isLastLoginAccount = checkIsTheLastLoginGuardian(userGuardiansList, editGuardian);
        if (isLastLoginAccount) {
          ActionSheet.alert({
            title2: t('This guardian is the only login account and cannot be turned off'),
            buttons: [
              {
                title: t('Close'),
              },
            ],
          });
          return;
        }
        onCancelLoginAccount();
        return;
      }

      const loginIndex = userGuardiansList.findIndex(
        item =>
          item.isLoginGuardian &&
          guardianTypeStrToEnum(item.sendVerifyCodeParams.type) === guardian.guardianType &&
          item.sendVerifyCodeParams.guardianIdentifier === guardian.guardianAccount &&
          item.sendVerifyCodeParams.verifierId !== guardian.verifier?.id,
      );
      if (loginIndex === -1) {
        Loading.show();
        try {
          const guardiansInfo = await NetworkController.getGuardianInfo(guardian.guardianAccount);
          console.log('guardiansInfo check:', guardiansInfo);
          if (guardiansInfo?.guardianList?.guardians?.length) {
            throw { code: '20004' };
          }
        } catch (error: any) {
          if (error.code === '20004') {
            Loading.hide();
            ActionSheet.alert({
              title2: t(`This account address is already a login account and cannot be used`),
              buttons: [
                {
                  title: t('Close'),
                },
              ],
            });
            return;
          }
        } finally {
          Loading.hide();
        }
      }

      if ([LoginType.Apple, LoginType.Google].includes(guardian.guardianType)) {
        Loading.show();
        try {
          const userInfo = await (guardian.guardianType === LoginType.Apple ? appleSign : googleSign)();
          if (userInfo.user.id !== guardian.guardianAccount) throw new Error('Account does not match your guardian');
          CommonToast.success('Verified Successfully');
          await onSetLoginAccount();
        } catch (error) {
          CommonToast.failError(error);
        }
        Loading.hide();
        return;
      }

      ActionSheet.alert({
        title2: (
          <Text>
            <TextL>{`${guardian.verifier?.name} will send a verification code to `}</TextL>
            <TextL style={fonts.mediumFont}>{guardian.guardianAccount}</TextL>
            <TextL>{` to verify your ${
              guardian.guardianType === LoginType.Phone ? 'phone number' : 'email address'
            }.`}</TextL>
          </Text>
        ),
        buttons: [
          {
            title: t('Cancel'),
            type: 'outline',
          },
          {
            title: t('Confirm'),
            onPress: sendLoginAccountVerify,
          },
        ],
      });
    },
    [
      appleSign,
      editGuardian,
      googleSign,
      guardian,
      onCancelLoginAccount,
      onSetLoginAccount,
      sendLoginAccountVerify,
      t,
      userGuardiansList,
    ],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={t('Guardians')}
      leftCallback={() => {
        onFinish({
          status: 'cancel',
        });
      }}
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
            <TextM>{guardian?.verifier?.name || ''}</TextM>
          </View>
        </View>

        <View style={pageStyles.loginSwitchWrap}>
          <TextL>{t('Login account')}</TextL>
          <CommonSwitch
            value={guardian === undefined ? false : guardian.isLoginAccount}
            onValueChange={onLoginAccountChange}
          />
        </View>

        {/* <TextM style={pageStyles.tips}>
          {t('The login account will be able to log in and control all your assets')}
        </TextM> */}
      </View>
      {userGuardiansList && userGuardiansList.length > 1 && (
        <CommonButton
          style={pageStyles.bottomButton}
          type="primary"
          onPress={() => {
            navigateTo(PortkeyEntries.MODIFY_GUARDIAN_ENTRY, {
              closeCurrentScreen: false,
              params: {
                info: JSON.stringify({
                  particularGuardianInfo: editGuardian,
                  originalGuardianItem: guardian,
                }),
              },
            });
          }}>
          {t('Edit')}
        </CommonButton>
      )}
    </PageContainer>
  );
}
