import { TextM, TextXXXL } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GUARDIAN_EXPIRED_TIME, VERIFIER_EXPIRATION } from '@portkey-wallet/constants/misc';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { BorderStyles, FontStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { getApprovalCount } from '@portkey-wallet/utils/guardian';
import { ApprovalType, OperationTypeEnum, VerifyStatus } from '@portkey-wallet/types/verifier';
import GuardianItem from '../components/GuardianItem';
import useEffectOnce from 'hooks/useEffectOnce';
import Touchable from 'components/Touchable';
import ActionSheet from 'components/ActionSheet';
import myEvents from 'utils/deviceEvent';
import { GuardiansStatus, GuardiansStatusItem } from '../types';
import { SocialRecoveryConfig } from 'model/verify/social-recovery';
import { GuardianConfig } from 'model/verify/guardian';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { GuardianApprovalPageResult } from 'components/entries/GuardianApproval';
import Loading from 'components/Loading';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';
import { guardianTypeStrToEnum, isReacptchaOpen } from 'model/global';
import { NetworkController } from 'network/controller';
import { VerifierDetailsPageProps } from 'components/entries/VerifierDetails';
import { PortkeyEntries } from 'config/entries';
import {
  AccountOriginalType,
  AfterVerifiedConfig,
  VerifiedGuardianDoc,
  defaultExtraData,
} from 'model/verify/after-verify';
import { VerifyPageResult } from '../VerifierDetails';
import useBaseContainer from 'model/container/UseBaseContainer';
import { defaultColors } from 'assets/theme';
import CommonToast from 'components/CommonToast';
import { PortkeyConfig } from 'global';
import AElf from 'aelf-sdk';
import { randomId } from '@portkey-wallet/utils';
import { ApprovedGuardianInfo } from 'network/dto/wallet';

export default function GuardianApproval({
  guardianListConfig,
  verifiedTime,
  onPageFinish,
}: {
  guardianListConfig: SocialRecoveryConfig;
  verifiedTime: number;
  onPageFinish: (result: GuardianApprovalPageResult) => void;
}) {
  const { guardians, accountIdentifier, accountOriginalType } = guardianListConfig;
  const { t } = useLanguage();

  const { navigateForResult } = useBaseContainer({
    entryName: PortkeyEntries.GUARDIAN_APPROVAL_ENTRY,
  });

  const [guardiansStatus, setApproved] = useState<GuardiansStatus>();
  const [isExpired, setIsExpired] = useState<boolean>();

  const guardianExpiredTime = useRef<number>();
  const approvedList = useMemo(() => {
    return Object.values(guardiansStatus || {}).filter(guardian => guardian.status === VerifyStatus.Verified);
  }, [guardiansStatus]);

  const [sentGuardianKeys, setSentGuardianKeys] = useState<Map<string, string>>(new Map());

  const setGuardianStatus = useCallback((key: string, status: GuardiansStatusItem) => {
    if (key === 'resetGuardianApproval') {
      setApproved(undefined);
      guardianExpiredTime.current = undefined;
    } else {
      setApproved(preGuardiansStatus => ({ ...preGuardiansStatus, [key]: status }));
    }
  }, []);

  const guardianCount = useMemo(() => getApprovalCount(guardians?.length || 0), [guardians?.length]);
  const isSuccess = useMemo(() => guardianCount <= approvedList.length, [guardianCount, approvedList.length]);
  const onSetGuardianStatus = useCallback(
    (data: { key: string; status: GuardiansStatusItem }) => {
      setGuardianStatus(data.key, data.status);
      if (!guardianExpiredTime.current && data.status?.status === VerifyStatus.Verified)
        guardianExpiredTime.current = Date.now() + GUARDIAN_EXPIRED_TIME;
    },
    [setGuardianStatus],
  );
  useEffectOnce(() => {
    const listener = myEvents.setGuardianStatus.addListener(onSetGuardianStatus);
    const expiredTimer = setInterval(() => {
      if (guardianExpiredTime.current && Date.now() > guardianExpiredTime.current) setIsExpired(true);
    }, 1000);
    if (verifiedTime) guardianExpiredTime.current = verifiedTime + GUARDIAN_EXPIRED_TIME;
    return () => {
      listener.remove();
      expiredTimer && clearInterval(expiredTimer);
    };
  });

  const onBack = () => {
    onPageFinish({
      isVerified: false,
    });
  };

  const getVerifiedData = (): AfterVerifiedConfig => {
    const wallet = AElf.wallet.createNewWallet();
    const { address } = wallet;
    return {
      fromRecovery: true,
      accountIdentifier,
      chainId: PortkeyConfig.currChainId(),
      extraData: defaultExtraData,
      manager: address,
      context: {
        clientId: address,
        requestId: randomId(),
      },
      verifiedGuardians: getVerifiedGuardianInfo(),
    };
  };

  const getVerifiedGuardianInfo = (): Array<ApprovedGuardianInfo> => {
    return Object.entries(guardiansStatus || {})
      .map(([key, value]) => {
        const guardianInfo = guardians[Number(key)];
        if (value.status === VerifyStatus.Verified && guardianInfo) {
          return {
            type: guardianTypeStrToEnum(guardianInfo.sendVerifyCodeParams.type),
            identifier: accountIdentifier,
            verifierId: guardianInfo.sendVerifyCodeParams.verifierId,
            verificationDoc: value.verifierInfo?.verificationDoc,
            signature: value.verifierInfo?.signature,
          } as ApprovedGuardianInfo;
        } else {
          return null;
        }
      })
      .filter(item => item !== null) as any;
  };

  const onFinish = () => {
    onPageFinish({
      isVerified: true,
      deliveredVerifiedData: JSON.stringify(getVerifiedData()),
    });
  };
  const parseGuardianInfo = (guardianArray: Array<GuardianConfig>): Array<UserGuardianItem> => {
    return guardianArray?.map((item, index) => {
      return {
        ...item,
        guardianAccount: accountIdentifier,
        isLoginAccount: item.isLoginGuardian,
        guardianType: guardianTypeStrToEnum(item.sendVerifyCodeParams.type) as any,
        key: `${index}`,
        identifierHash: '',
      } as UserGuardianItem;
    });
  };

  const particularButton = (guardian: GuardianConfig, key: string) => {
    const isVerified = guardiansStatus?.[key]?.status === VerifyStatus.Verified;
    const getTitle = () => {
      if (sentGuardianKeys.has(key)) {
        return 'Verify';
      } else {
        return 'Send';
      }
    };
    return isVerified ? (
      <Text style={styles.confirmedButtonText}>Confirmed</Text>
    ) : (
      <CommonButton
        onPress={() => {
          dealWithParticularGuardian(guardian, key);
        }}
        disabled={false}
        containerStyle={styles.activityButton}
        titleStyle={styles.activityButtonText}
        type={isVerified ? 'clear' : 'primary'}
        title={getTitle()}
      />
    );
  };

  const dealWithParticularGuardian = async (guardian: GuardianConfig, key: string) => {
    if (sentGuardianKeys.has(key)) {
      const verifierSessionId = sentGuardianKeys.get(key);
      const guardianResult = await handleGuardianVerifyPage(
        Object.assign({}, guardian, {
          verifierSessionId,
        } as Partial<GuardianConfig>),
        true,
        key,
      );
      if (guardianResult) {
        setGuardianStatus(key, { status: VerifyStatus.Verified });
        return;
      } else {
        CommonToast.fail('guardian verify failed, please try again.');
        Loading.hide();
      }
    } else {
      ActionSheet.alert({
        title: '',
        message: `${guardian.name ?? 'Portkey'} will send a verification code to ${accountIdentifier} to verify your ${
          accountOriginalType === AccountOriginalType.Email ? 'email' : 'phone number'
        }.`,
        buttons: [
          { title: 'Cancel', type: 'outline' },
          {
            title: 'Confirm',
            onPress: async () => {
              try {
                Loading.show();
                const needRecaptcha = await isReacptchaOpen(OperationTypeEnum.communityRecovery);
                let token: string | undefined;
                if (needRecaptcha) {
                  token = (await verifyHumanMachine('en')) as string;
                }
                const sendResult = await NetworkController.sendVerifyCode(guardian.sendVerifyCodeParams, {
                  reCaptchaToken: token,
                });
                Loading.hide();
                if (sendResult) {
                  setSentGuardianKeys(preGuardianKeys => {
                    preGuardianKeys.set(key, sendResult.verifierSessionId);
                    return new Map(preGuardianKeys);
                  });
                  const guardianResult = await handleGuardianVerifyPage(
                    Object.assign({}, guardian, {
                      verifySessionId: sendResult.verifierSessionId,
                    } as Partial<GuardianConfig>),
                    true,
                    key,
                  );
                  if (guardianResult) {
                    setGuardianStatus(key, { status: VerifyStatus.Verified, verifierInfo: guardianResult });
                    return;
                  }
                }
                CommonToast.fail('guardian verify failed, please try again.');
                Loading.hide();
              } catch (e) {
                CommonToast.fail('network fail.');
                Loading.hide();
              }
            },
          },
        ],
      });
    }
  };

  const handleGuardianVerifyPage = async (
    guardianConfig?: GuardianConfig,
    alreadySent?: boolean,
    key?: string,
  ): Promise<VerifiedGuardianDoc | null> => {
    const guardian = guardianConfig;
    if (!guardian) {
      console.error('guardianConfig is not defined.');
      return null;
    }
    return new Promise(resolve => {
      navigateToGuardianPage(Object.assign({}, guardian, { alreadySent: alreadySent ?? false }), result => {
        console.error('config.navigateToGuardianPage', result);
        if (result) {
          setApproved(preGuardiansStatus => ({
            ...preGuardiansStatus,
            [key ?? '0']: { status: VerifyStatus.Verified },
          }));
          resolve(result);
        } else {
          resolve(null);
        }
      });
    });
  };

  const navigateToGuardianPage = (config: GuardianConfig, callback: (result: VerifiedGuardianDoc) => void) => {
    navigateForResult<VerifyPageResult, VerifierDetailsPageProps>(
      PortkeyEntries.VERIFIER_DETAIL_ENTRY,
      {
        params: {
          deliveredGuardianInfo: JSON.stringify(config),
        },
      },
      res => {
        Loading.hide();
        const { data } = res;
        callback(data?.verifiedData ? JSON.parse(data.verifiedData) : null);
      },
    );
  };

  return (
    <PageContainer
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.containerStyle}
      leftIconType="close"
      leftCallback={onBack}
      backTitle={'Wallet Login'}
      type="leftBack"
      titleDom
      hideTouchable>
      <View style={GStyles.flex1}>
        <TextXXXL style={GStyles.alignCenter}>{t(`Guardians' approval`)}</TextXXXL>
        <TextM style={[styles.expireText, GStyles.alignCenter, FontStyles.font3]}>
          {isExpired ? 'Expired' : `Expire after ${VERIFIER_EXPIRATION} hour`}
        </TextM>
        <View style={[styles.verifierBody, GStyles.flex1]}>
          <View style={[GStyles.itemCenter, GStyles.flexRowWrap, BorderStyles.border6, styles.approvalTitleRow]}>
            <View style={[GStyles.itemCenter, GStyles.flexRowWrap, styles.approvalRow]}>
              <TextM style={[FontStyles.font3, styles.approvalTitle]}>{`Guardians' approval`}</TextM>
              <Touchable
                onPress={() =>
                  ActionSheet.alert({
                    title2: `You will need a certain number of guardians to confirm your action. The requirements differ depending on your guardian counts. If the total number is less than or equal to 3, approval from all is needed. If that figure is greater than 3, approval from a minimum of 60% is needed.`,
                    buttons: [{ title: 'OK' }],
                  })
                }>
                <Svg color={FontStyles.font3.color} size={pTd(16)} icon="question-mark" />
              </Touchable>
            </View>
            <TextM>
              <TextM style={FontStyles.font4}>{approvedList.length ?? 0}</TextM>/{guardianCount}
            </TextM>
          </View>
          <View style={GStyles.flex1}>
            <ScrollView>
              {parseGuardianInfo(guardians)?.map((item, index) => {
                return (
                  <GuardianItem
                    key={index}
                    guardianItem={item}
                    isButtonHide={true}
                    renderBtn={_ => {
                      return particularButton(guardians[index], item.key);
                    }}
                    setGuardianStatus={onSetGuardianStatus}
                    guardiansStatus={guardiansStatus}
                    isExpired={isExpired}
                    isSuccess={isSuccess}
                    approvalType={ApprovalType.communityRecovery}
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
      {!isExpired && <CommonButton onPress={onFinish} disabled={!isSuccess} type="primary" title={'Confirm'} />}
    </PageContainer>
  );
}

const { primaryColor } = defaultColors;

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'space-between',
  },
  activityButton: {
    height: 24,
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor,
  },
  confirmButton: {
    height: 24,
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activityButtonText: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 16,
  },
  confirmedButtonText: {
    color: 'green',
    fontSize: 12,
    lineHeight: 16,
    backgroundColor: '#fff',
  },
  expireText: {
    marginTop: 8,
  },
  verifierBody: {
    marginTop: 40,
  },
  approvalTitleRow: {
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  approvalRow: {
    paddingBottom: 12,
  },
  approvalTitle: {
    marginRight: pTd(7),
  },
});
