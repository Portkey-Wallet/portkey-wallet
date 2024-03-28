import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton, { CommonButtonProps } from 'components/CommonButton';
import { TextM, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import fonts from 'assets/theme/fonts';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { sleep } from '@portkey-wallet/utils';
import {
  ApprovalType,
  AuthenticationInfo,
  VerificationType,
  OperationTypeEnum,
  VerifierInfo,
  VerifyStatus,
} from '@portkey-wallet/types/verifier';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { LOGIN_GUARDIAN_TYPE_ICON } from 'constants/misc';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { VerifierImage } from '../VerifierImage';
import { GuardiansStatus, GuardiansStatusItem } from 'pages/Guardian/types';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { verification } from 'utils/api';
import { useVerifyToken } from 'hooks/authentication';
import { PRIVATE_GUARDIAN_ACCOUNT } from '@portkey-wallet/constants/constants-ca/guardian';
import myEvents from 'utils/deviceEvent';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import {
  APPROVAL_TO_OPERATION_MAP,
  APPROVAL_TO_VERIFICATION_MAP,
} from '@portkey-wallet/constants/constants-ca/verifier';
import { ChainId } from '@portkey-wallet/types';
import { AuthTypes } from 'constants/guardian';

interface GuardianAccountItemProps {
  guardianItem: UserGuardianItem;
  isButtonHide?: boolean;
  renderBtn?: (item: UserGuardianItem) => JSX.Element;
  isBorderHide?: boolean;
  guardiansStatus?: GuardiansStatus;
  setGuardianStatus?: (data: { key: string; status: GuardiansStatusItem }) => void;
  isExpired?: boolean;
  isSuccess?: boolean;
  approvalType?: ApprovalType;
  authenticationInfo?: AuthenticationInfo;
  targetChainId?: ChainId;
}

function GuardianItemButton({
  guardianItem,
  guardiansStatus,
  setGuardianStatus,
  isExpired,
  approvalType,
  disabled,
  authenticationInfo,
  targetChainId,
}: GuardianAccountItemProps & {
  disabled?: boolean;
}) {
  const itemStatus = useMemo(() => guardiansStatus?.[guardianItem.key], [guardianItem.key, guardiansStatus]);

  const { status, requestCodeResult } = itemStatus || {};
  const verifyToken = useVerifyToken();
  const guardianInfo = useMemo(() => {
    return {
      guardianItem,
      verificationType:
        APPROVAL_TO_VERIFICATION_MAP[approvalType as ApprovalType] || VerificationType.communityRecovery,
    };
  }, [approvalType, guardianItem]);

  const operationType: OperationTypeEnum = useMemo(
    () => APPROVAL_TO_OPERATION_MAP[approvalType as ApprovalType] || OperationTypeEnum.unknown,
    [approvalType],
  );

  const onSetGuardianStatus = useCallback(
    (guardianStatus: GuardiansStatusItem) => {
      setGuardianStatus?.({ key: guardianItem.key, status: guardianStatus });
    },
    [guardianItem.key, setGuardianStatus],
  );
  const originChainId = useOriginChainId();

  const onSendCode = useThrottleCallback(async () => {
    try {
      Loading.show();
      const req = await verification.sendVerificationCode({
        params: {
          type: LoginType[guardianInfo.guardianItem.guardianType],
          guardianIdentifier: guardianInfo.guardianItem.guardianAccount,
          verifierId: guardianInfo.guardianItem.verifier?.id,
          chainId: originChainId,
          operationType,
          targetChainId,
        },
      });
      if (req.verifierSessionId) {
        Loading.hide();
        await sleep(200);
        onSetGuardianStatus({
          requestCodeResult: req,
          status: VerifyStatus.Verifying,
        });
        navigationService.push('VerifierDetails', {
          ...guardianInfo,
          requestCodeResult: req,
          targetChainId,
        });
      } else {
        throw new Error('send fail');
      }
    } catch (error) {
      console.log(error, '====error');

      CommonToast.failError(error);
    }
    Loading.hide();
  }, [guardianInfo, originChainId, operationType, targetChainId, onSetGuardianStatus]);

  const onVerifierAuth = useCallback(async () => {
    try {
      Loading.show();

      const rst = await verifyToken(guardianItem.guardianType, {
        accessToken: authenticationInfo?.[guardianItem.guardianAccount],
        id: guardianItem.guardianAccount,
        verifierId: guardianItem.verifier?.id,
        chainId: originChainId,
        operationType,
        targetChainId,
      });

      if (rst.accessToken) {
        myEvents.setAuthenticationInfo.emit({
          [guardianItem.guardianAccount]: rst.accessToken,
        });
      }

      CommonToast.success('Verified Successfully');
      const verifierInfo: VerifierInfo = { ...rst, verifierId: guardianItem?.verifier?.id };
      onSetGuardianStatus({
        status: VerifyStatus.Verified,
        verifierInfo,
      });
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [
    authenticationInfo,
    guardianItem.guardianAccount,
    guardianItem.guardianType,
    guardianItem.verifier?.id,
    onSetGuardianStatus,
    operationType,
    originChainId,
    targetChainId,
    verifyToken,
  ]);
  const onVerifier = useThrottleCallback(async () => {
    switch (guardianItem.guardianType) {
      case LoginType.Apple:
      case LoginType.Google:
      case LoginType.Telegram:
      case LoginType.Twitter:
      case LoginType.Facebook:
        onVerifierAuth();
        break;
      default: {
        navigationService.push('VerifierDetails', {
          ...guardianInfo,
          requestCodeResult,
          targetChainId,
          startResend: true,
        });
        break;
      }
    }
  }, [guardianItem.guardianType, onVerifierAuth, guardianInfo, requestCodeResult, targetChainId]);
  const buttonProps: CommonButtonProps = useMemo(() => {
    // expired
    if (isExpired && status !== VerifyStatus.Verified) {
      return {
        disabled: true,
        type: 'clear',
        title: 'Expired',
        disabledStyle: BGStyles.transparent,
        disabledTitleStyle: FontStyles.font7,
      };
    }
    if (
      status === VerifyStatus.Verifying ||
      (AuthTypes.includes(guardianItem.guardianType) && (!status || status === VerifyStatus.NotVerified))
    ) {
      return {
        onPress: onVerifier,
        title: 'Verify',
      };
    }
    if (!status || status === VerifyStatus.NotVerified) {
      return {
        onPress: onSendCode,
        title: 'Send',
      };
    }
    return {
      title: 'Confirmed',
      type: 'clear',
      disabledTitleStyle: FontStyles.font10,
      disabledStyle: styles.confirmedButtonStyle,
      disabled: true,
    };
  }, [guardianItem.guardianType, isExpired, onSendCode, onVerifier, status]);
  return (
    <CommonButton
      type="primary"
      radius={pTd(6)}
      disabled={disabled}
      disabledTitleStyle={styles.disabledTitleStyle}
      disabledStyle={styles.disabledItemStyle}
      {...buttonProps}
      titleStyle={[styles.titleStyle, fonts.mediumFont, buttonProps.titleStyle]}
      buttonStyle={[styles.buttonStyle, buttonProps.buttonStyle]}
    />
  );
}

export default function GuardianItem({
  guardianItem,
  isButtonHide,
  renderBtn,
  isBorderHide = false,
  guardiansStatus,
  setGuardianStatus,
  isExpired,
  isSuccess,
  approvalType = ApprovalType.communityRecovery,
  authenticationInfo,
  targetChainId,
}: GuardianAccountItemProps) {
  const itemStatus = useMemo(() => guardiansStatus?.[guardianItem.key], [guardianItem.key, guardiansStatus]);
  const disabled = isSuccess && itemStatus?.status !== VerifyStatus.Verified;

  const guardianAccount = useMemo(() => {
    if (!AuthTypes.includes(guardianItem.guardianType)) {
      return guardianItem.guardianAccount;
    }
    if (guardianItem.isPrivate) return PRIVATE_GUARDIAN_ACCOUNT;
    return guardianItem.thirdPartyEmail || '';
  }, [guardianItem]);

  const renderGuardianAccount = useCallback(() => {
    if (!guardianItem.firstName) {
      return (
        <TextM
          numberOfLines={AuthTypes.includes(guardianItem.guardianType) ? 1 : 2}
          style={[styles.nameStyle, GStyles.flex1]}>
          {guardianAccount}
        </TextM>
      );
    }
    return (
      <View style={[styles.nameStyle, GStyles.flex1]}>
        <TextM style={styles.firstNameStyle} numberOfLines={1}>
          {guardianItem.firstName}
        </TextM>
        <TextS style={FontStyles.font3} numberOfLines={1}>
          {guardianAccount}
        </TextS>
      </View>
    );
  }, [guardianAccount, guardianItem.firstName, guardianItem.guardianType]);

  return (
    <View style={[styles.itemRow, isBorderHide && styles.itemWithoutBorder, disabled && styles.disabledStyle]}>
      {guardianItem.isLoginAccount && (
        <View style={styles.typeTextRow}>
          <Text style={styles.typeText}>Login Account</Text>
        </View>
      )}
      <View style={[GStyles.flexRowWrap, GStyles.itemCenter, GStyles.flex1]}>
        <View style={[GStyles.center, styles.loginTypeIconWrap]}>
          <Svg icon={LOGIN_GUARDIAN_TYPE_ICON[guardianItem.guardianType]} size={pTd(18)} />
        </View>

        <VerifierImage
          size={pTd(32)}
          label={guardianItem?.verifier?.name}
          uri={guardianItem.verifier?.imageUrl}
          style={styles.iconStyle}
        />
        {renderGuardianAccount()}
      </View>
      {!isButtonHide && (
        <GuardianItemButton
          disabled={disabled}
          isExpired={isExpired}
          guardianItem={guardianItem}
          guardiansStatus={guardiansStatus}
          setGuardianStatus={setGuardianStatus}
          approvalType={approvalType}
          authenticationInfo={authenticationInfo}
          targetChainId={targetChainId}
        />
      )}
      {renderBtn && renderBtn(guardianItem)}
    </View>
  );
}

const styles = StyleSheet.create({
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
  itemWithoutBorder: {
    borderBottomColor: 'transparent',
  },
  typeText: {
    color: defaultColors.font6,
    fontSize: pTd(10),
    lineHeight: pTd(16),
  },
  typeTextRow: {
    left: 0,
    top: 0,
    height: pTd(16),
    position: 'absolute',
    width: 'auto',
    paddingHorizontal: pTd(6),
    backgroundColor: defaultColors.bg11,
    borderTopLeftRadius: pTd(6),
    borderBottomRightRadius: pTd(6),
  },
  iconStyle: {
    marginLeft: pTd(-6),
  },
  nameStyle: {
    marginLeft: pTd(12),
  },
  firstNameStyle: {
    marginBottom: pTd(2),
  },
  buttonStyle: {
    height: pTd(24),
    minWidth: pTd(54),
  },
  titleStyle: {
    lineHeight: pTd(22),
    height: pTd(24),
    fontSize: pTd(12),
  },
  confirmedButtonStyle: {
    opacity: 1,
    backgroundColor: 'transparent',
  },
  verifierStyle: {
    marginLeft: pTd(-6),
  },
  disabledStyle: {
    opacity: 0.4,
  },
  disabledTitleStyle: {
    opacity: 1,
  },
  disabledItemStyle: {
    opacity: 1,
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
