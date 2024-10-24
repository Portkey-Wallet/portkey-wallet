import GStyles from 'assets/theme/GStyles';
import CommonButton, { CommonButtonProps } from 'components/CommonButton';
import { TextL, TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { useCallback, useMemo } from 'react';
import { Image, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
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
  zkLoginVerifierItem,
} from '@portkey-wallet/types/verifier';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { GUARDIAN_ITEM_TYPE_ICON } from 'constants/misc';
import { LoginType, isZKLoginSupported } from '@portkey-wallet/types/types-ca/wallet';
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
import { makeStyles } from '@rneui/themed';

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
  extra?: {
    identifierHash?: string;
    guardianType?: string;
    verifierId?: string;
    preVerifierId?: string;
    newVerifierId?: string;
    symbol?: string;
    amount?: string | number;
    toAddress?: string;
    singleLimit?: string;
    dailyLimit?: string;
    spender?: string;
    verifyManagerAddress?: string;
  };
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
  extra,
}: GuardianAccountItemProps & {
  disabled?: boolean;
}) {
  const styles = getStyles();

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
          operationDetails: JSON.stringify({ ...extra }),
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
          operationDetails: JSON.stringify({ ...extra }),
        });
      } else {
        throw new Error('send fail');
      }
    } catch (error) {
      console.log(error, '====error');

      CommonToast.failError(error);
    }
    Loading.hide();
  }, [guardianInfo, originChainId, operationType, targetChainId, onSetGuardianStatus, extra]);

  const onVerifierAuth = useCallback(async () => {
    try {
      Loading.show();
      const rst = await verifyToken(guardianItem.guardianType, {
        accessToken: authenticationInfo?.[guardianItem.guardianAccount] as string,
        idToken: authenticationInfo?.idToken as string,
        timestamp: authenticationInfo?.timestamp as number,
        nonce: authenticationInfo?.nonce as string,
        salt: guardianItem.salt,
        id: guardianItem.guardianAccount,
        verifierId: guardianItem.verifier?.id,
        chainId: originChainId,
        operationType,
        targetChainId,
        operationDetails: JSON.stringify({ ...extra }),
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
    extra,
    guardianItem.guardianAccount,
    guardianItem.guardianType,
    guardianItem.salt,
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
          operationDetails: JSON.stringify({ ...extra }),
        });
        break;
      }
    }
  }, [guardianItem.guardianType, onVerifierAuth, guardianInfo, requestCodeResult, targetChainId, extra]);
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
      title: 'Approved',
      type: 'transparent',
      disabledTitleStyle: styles.approvedTitleStyles,
      disabledStyle: styles.confirmedButtonStyle,
      disabled: true,
    };
  }, [
    guardianItem.guardianType,
    isExpired,
    onSendCode,
    onVerifier,
    status,
    styles.approvedTitleStyles,
    styles.confirmedButtonStyle,
  ]);
  return (
    <CommonButton
      type="primary"
      disabled={disabled}
      disabledTitleStyle={styles.disabledTitleStyle}
      disabledStyle={styles.disabledItemStyle}
      {...buttonProps}
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
  extra,
}: GuardianAccountItemProps) {
  const styles = getStyles();
  const itemStatus = useMemo(() => guardiansStatus?.[guardianItem.key], [guardianItem.key, guardiansStatus]);
  const disabled = isSuccess && itemStatus?.status !== VerifyStatus.Verified;

  const guardianAccount = useMemo(() => {
    if (!AuthTypes.includes(guardianItem.guardianType)) {
      return guardianItem.guardianAccount;
    }
    if (guardianItem.isPrivate) return PRIVATE_GUARDIAN_ACCOUNT;
    return guardianItem.thirdPartyEmail || '';
  }, [guardianItem]);

  const isVerifierReplacedByZk = useMemo(() => {
    return (
      isZKLoginSupported(guardianItem.guardianType) && !guardianItem.verifiedByZk && !guardianItem.manuallySupportForZk
    );
  }, [guardianItem]);

  const renderGuardianAccount = useCallback(() => {
    if (!guardianItem.firstName) {
      return (
        <TextL
          numberOfLines={AuthTypes.includes(guardianItem.guardianType) ? 1 : 2}
          style={[styles.nameStyle, GStyles.flex1]}>
          {guardianAccount}
        </TextL>
      );
    }
    return (
      <View style={[styles.nameStyle, GStyles.flex1]}>
        <TextL numberOfLines={1}>{guardianItem.firstName}</TextL>
        <TextM style={styles.subNameText} numberOfLines={1}>
          {guardianAccount}
        </TextM>
      </View>
    );
  }, [guardianAccount, guardianItem.firstName, guardianItem.guardianType, styles.nameStyle, styles.subNameText]);

  const verifierName = useMemo(() => {
    return isZKLoginSupported(guardianItem.guardianType) &&
      (guardianItem.verifiedByZk || guardianItem.manuallySupportForZk)
      ? zkLoginVerifierItem.name
      : guardianItem.verifier?.name || '';
  }, [guardianItem]);

  const verifierImageUrl = useMemo(() => {
    return isZKLoginSupported(guardianItem.guardianType) &&
      (guardianItem.verifiedByZk || guardianItem.manuallySupportForZk)
      ? zkLoginVerifierItem.imageUrl
      : guardianItem.verifier?.imageUrl || '';
  }, [guardianItem]);

  return (
    <View style={[styles.itemRow, disabled && styles.disabledStyle]}>
      <View style={[GStyles.flexRowWrap, GStyles.itemCenter, GStyles.flex1, styles.itemContent]}>
        <View style={[GStyles.flexRowWrap, GStyles.itemCenter]}>
          <VerifierImage size={pTd(42)} label={verifierName} uri={verifierImageUrl} />
          <Svg
            iconStyle={styles.loginTypeIconWrap}
            icon={GUARDIAN_ITEM_TYPE_ICON[guardianItem.guardianType]}
            size={pTd(42)}
          />

          {isVerifierReplacedByZk && (
            <View style={styles.zkLoginWaterMarkWrap}>
              <Image source={require('assets/image/pngs/zklogin_verifier.png')} style={styles.zkLoginWaterMarkIcon} />
            </View>
          )}
        </View>
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
          extra={extra}
        />
      )}
      {renderBtn && renderBtn(guardianItem)}
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  itemRow: {
    height: pTd(74),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    paddingRight: pTd(8),
  },
  loginTypeIconWrap: {
    marginLeft: pTd(-8),
  },
  zkLoginWaterMarkWrap: {
    position: 'absolute',
    width: '100%',
    bottom: pTd(-6),
    alignItems: 'center',
  },
  zkLoginWaterMarkIcon: {
    width: pTd(46),
    height: pTd(14),
  },

  nameStyle: {
    marginLeft: pTd(8),
  },
  subNameText: {
    color: theme.colors.textBase2,
  },

  buttonStyle: {
    height: pTd(40),
    minWidth: pTd(84),
    borderRadius: pTd(20),
  },
  approvedTitleStyles: {
    color: theme.colors.textBase3,
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
}));
