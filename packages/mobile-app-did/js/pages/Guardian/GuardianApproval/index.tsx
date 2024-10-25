import { TextH1, TextM } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GUARDIAN_EXPIRED_TIME } from '@portkey-wallet/constants/misc';
import { DeviceEventEmitter, ScrollView, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { getApprovalCount } from '@portkey-wallet/utils/guardian';
import {
  ApprovalType,
  AuthenticationInfo,
  VerificationType,
  VerifierInfo,
  VerifyStatus,
} from '@portkey-wallet/types/verifier';
import GuardianItem from '../components/GuardianItem';
import useEffectOnce from 'hooks/useEffectOnce';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import navigationService from 'utils/navigationService';
import { LoginType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import myEvents from 'utils/deviceEvent';
import Loading from 'components/Loading';
import { useGuardiansInfo } from 'hooks/store';
import { useCurrentWalletInfo, useOriginChainId, useVerifyManagerAddress } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CommonToast from 'components/CommonToast';
import { useAppDispatch } from 'store/hooks';
import { setPreGuardianAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import {
  addGuardian,
  deleteGuardian,
  editGuardian,
  getGuardiansApproved,
  modifyTransferLimit,
  removeOtherManager,
  setLoginAccount,
  unsetLoginAccount,
} from 'utils/guardian';
import { useGetCAContract, useGetCurrentCAContract } from 'hooks/contract';
import { GuardiansApproved, GuardiansStatus, GuardiansStatusItem } from '../types';
import { handleGuardiansApproved } from 'utils/login';
import { useOnRequestOrSetPin } from 'hooks/login';
import { ApproveParams } from 'dapp/dappOverlay';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-ca/discover/slice';
import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { sleep } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { useLatestRef, useThrottleCallback } from '@portkey-wallet/hooks';
import { useUpdateTransferLimit } from '@portkey-wallet/hooks/hooks-ca/security';
import { useCheckRouteExistInRouteStack } from 'hooks/route';
import { useRefreshGuardianList } from 'hooks/guardian';
import { SendResult } from '@portkey-wallet/contracts/types';
import { useIsFocused } from '@react-navigation/native';
import { NavigateMultiLevelParams } from 'types/navigate';
import { isCrossChain } from '@portkey-wallet/utils/aelf';
import { useGetTransferFee } from 'hooks/transfer';
import { useReportUnsetLoginGuardian } from 'hooks/authentication';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { GuardianApproveTip } from './components/GuardianApproveTip';
import { GuardianExpired } from './components/GuardianExpired';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import { GuardianApproveProgress } from './components/GuardianApproveProgress';

export type RouterParams = {
  loginAccount?: string;
  userGuardiansList?: UserGuardianItem[];
  approvalType: ApprovalType;
  guardianItem?: UserGuardianItem;
  verifierInfo?: VerifierInfo;
  verifiedTime?: number;
  removeManagerAddress?: string;
  loginType?: LoginType;
  authenticationInfo?: AuthenticationInfo;
  approveParams?: ApproveParams;
  transferLimitDetail?: ITransferLimitItem;
  targetChainId?: ChainId;
  accelerateChainId?: ChainId;
  initGuardiansStatus?: GuardiansStatus;
};

type MultiLevelParams = Pick<
  NavigateMultiLevelParams,
  'successNavigate' | 'sendTransferPreviewApprove' | 'setLoginAccountNavigate'
>;
const EXCLUDE_CURRENT_APPROVAL_TYPES = [
  ApprovalType.deleteGuardian,
  ApprovalType.editGuardian,
  ApprovalType.setLoginAccount,
  ApprovalType.unsetLoginAccount,
];

export default function GuardianApproval() {
  const {
    loginAccount,
    userGuardiansList: paramUserGuardiansList,
    approvalType = ApprovalType.communityRecovery,
    guardianItem,
    verifierInfo,
    verifiedTime,
    removeManagerAddress,
    loginType,
    authenticationInfo: _authenticationInfo,
    approveParams,
    transferLimitDetail,
    targetChainId,
    accelerateChainId,
    initGuardiansStatus,

    // multiLevelParams
    successNavigate,
    sendTransferPreviewApprove,
    setLoginAccountNavigate,
  } = useRouterParams<RouterParams & MultiLevelParams>();
  // console.log(
  //   'useRouterParams<RouterParams & MultiLevelParams>()',
  //   JSON.stringify(useRouterParams<RouterParams & MultiLevelParams>()),
  // );

  const styles = getStyles();
  const dispatch = useAppDispatch();
  const checkRouteExistInRouteStack = useCheckRouteExistInRouteStack();
  const reportUnsetLoginAccount = useReportUnsetLoginGuardian();
  const verifyManagerAddress = useVerifyManagerAddress();
  const latestVerifyManagerAddress = useLatestRef(verifyManagerAddress);

  const onEmitDapp = useThrottleCallback(
    (guardiansApproved?: GuardiansApproved) => {
      if ((approvalType !== ApprovalType.managerApprove && approvalType !== ApprovalType.addGuardian) || !approveParams)
        return;
      approveParams.isDiscover && dispatch(changeDrawerOpenStatus(true));
      approveParams.eventName &&
        DeviceEventEmitter.emit(
          approveParams.eventName,
          guardiansApproved ? { approveInfo: approveParams.approveInfo, success: true, guardiansApproved } : undefined,
        );
    },
    [approvalType, approveParams, dispatch],
    2000,
  );

  const lastOnEmitDapp = useLatestRef(onEmitDapp);

  const { init: initGuardian } = useRefreshGuardianList();

  const { userGuardiansList: storeUserGuardiansList, preGuardian, verifierMap } = useGuardiansInfo();

  const verifierIdList = useMemo(
    () =>
      verifierMap
        ? Object.values(verifierMap)
            .map(verifier => verifier.id)
            .filter(verifierId => verifierId?.length > 0)
        : [],
    [verifierMap],
  );
  const randomVerifierId = useMemo(() => {
    const index = Math.floor(Math.random() * verifierIdList.length);
    return verifierIdList[index];
  }, [verifierIdList]);

  useEffectOnce(() => {
    initGuardian();
    return () => {
      lastOnEmitDapp.current();
    };
  });

  const userGuardiansList = useMemo(() => {
    if (paramUserGuardiansList) return paramUserGuardiansList;
    if (EXCLUDE_CURRENT_APPROVAL_TYPES.includes(approvalType)) {
      return storeUserGuardiansList?.filter(item => item.key !== guardianItem?.key);
    }
    return storeUserGuardiansList;
  }, [approvalType, guardianItem?.key, paramUserGuardiansList, storeUserGuardiansList]);
  const loginGuardians = useMemo(
    () => (userGuardiansList || []).filter(item => item.isLoginAccount),
    [userGuardiansList],
  );
  const otherGuardians = useMemo(
    () => (userGuardiansList || []).filter(item => !item.isLoginAccount),
    [userGuardiansList],
  );

  const { t } = useLanguage();
  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const updateTransferLimit = useUpdateTransferLimit();

  const originChainId = useOriginChainId();
  const getCurrentCAContract = useGetCurrentCAContract(targetChainId);
  const getCAContract = useGetCAContract();

  const [authenticationInfo, setAuthenticationInfo] = useState<AuthenticationInfo>(_authenticationInfo || {});
  useEffectOnce(() => {
    const listener = myEvents.setAuthenticationInfo.addListener((item: AuthenticationInfo) => {
      setAuthenticationInfo(preAuthenticationInfo => ({
        ...preAuthenticationInfo,
        ...item,
      }));
    });
    return () => {
      listener.remove();
    };
  });

  const [guardiansStatus, setApproved] = useState<GuardiansStatus | undefined>(initGuardiansStatus);
  const [isExpired, setIsExpired] = useState<boolean>();

  const guardianExpiredTimeRef = useRef<number>();
  const approvedAmount = useMemo(() => {
    return Object.values(guardiansStatus || {}).filter(guardian => guardian.status === VerifyStatus.Verified).length;
  }, [guardiansStatus]);

  const guardianCount = useMemo(() => getApprovalCount(userGuardiansList?.length || 0), [userGuardiansList?.length]);
  const isSuccess = useMemo(() => guardianCount <= approvedAmount, [guardianCount, approvedAmount]);
  const hasAutoConfirmed = useRef<boolean>(false);

  const onSetGuardianStatus = useCallback((data: { key: string; status: GuardiansStatusItem }) => {
    if (data.key === 'resetGuardianApproval') {
      setIsExpired(false);
      setApproved(undefined);
      guardianExpiredTimeRef.current = undefined;
    } else {
      setApproved(preGuardiansStatus => ({ ...preGuardiansStatus, [data.key]: data.status }));
    }

    if (!guardianExpiredTimeRef.current && data.status?.status === VerifyStatus.Verified)
      guardianExpiredTimeRef.current = Date.now() + GUARDIAN_EXPIRED_TIME;
  }, []);

  useEffectOnce(() => {
    const listener = myEvents.setGuardianStatus.addListener(onSetGuardianStatus);
    const expiredTimer = setInterval(() => {
      if (guardianExpiredTimeRef.current && Date.now() > guardianExpiredTimeRef.current) setIsExpired(true);
    }, 1000);
    if (verifiedTime) guardianExpiredTimeRef.current = verifiedTime + GUARDIAN_EXPIRED_TIME;
    return () => {
      listener.remove();
      expiredTimer && clearInterval(expiredTimer);
    };
  });

  const isFocused = useIsFocused();
  const latestIsFocused = useLatestRef(isFocused);
  useEffect(() => {
    if (isSuccess && !hasAutoConfirmed.current && latestIsFocused.current && !isExpired) {
      hasAutoConfirmed.current = true;
      onFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isExpired, latestIsFocused.current]);

  const onBack = useCallback(() => {
    lastOnEmitDapp.current();
    switch (approvalType) {
      case ApprovalType.addGuardian:
        if (approveParams?.isDiscover) {
          navigationService.navigate('Tab');
        } else {
          navigationService.navigate('GuardianEdit');
        }
        break;
      case ApprovalType.setLoginAccount:
      case ApprovalType.unsetLoginAccount:
        if (setLoginAccountNavigate) {
          navigationService.navigate(setLoginAccountNavigate.from, setLoginAccountNavigate.backParams);
        } else {
          navigationService.navigate('GuardianDetail', { guardian: guardianItem });
        }
        break;
      default:
        navigationService.goBack();
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalType, guardianItem, approveParams]);
  const onRequestOrSetPin = useOnRequestOrSetPin();

  const dappApprove = useCallback(() => {
    lastOnEmitDapp.current(
      handleGuardiansApproved(
        guardiansStatus as GuardiansStatus,
        userGuardiansList as UserGuardianItem[],
      ) as GuardiansApproved,
    );
    navigationService.goBack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guardiansStatus, userGuardiansList]);
  const registerAccount = useCallback(() => {
    onRequestOrSetPin({
      managerInfo: {
        verificationType: VerificationType.communityRecovery,
        loginAccount,
        type: loginType,
      } as ManagerInfo,
      guardiansApproved: handleGuardiansApproved(
        guardiansStatus as GuardiansStatus,
        userGuardiansList as UserGuardianItem[],
      ) as GuardiansApproved,
      verifierInfo,
    });
  }, [guardiansStatus, loginAccount, loginType, onRequestOrSetPin, userGuardiansList, verifierInfo]);

  const onAddGuardian = useCallback(async () => {
    if (!managerAddress || !caHash || !verifierInfo || !guardianItem || !guardiansStatus || !userGuardiansList) return;

    Loading.show({ text: t('Processing on the chain...') });
    let req: SendResult | undefined;
    try {
      // o != origin
      const caContract = await getCurrentCAContract();
      req = await addGuardian(
        caContract,
        managerAddress,
        caHash,
        verifierInfo,
        guardianItem,
        userGuardiansList,
        guardiansStatus,
        randomVerifierId,
      );
    } catch (error) {
      CommonToast.failError(error);
      Loading.hide();
      return;
    }

    if (accelerateChainId && accelerateChainId !== originChainId) {
      try {
        const accelerateCAContract = await getCAContract(accelerateChainId);
        await addGuardian(
          accelerateCAContract,
          managerAddress,
          caHash,
          verifierInfo,
          guardianItem,
          userGuardiansList,
          guardiansStatus,
          randomVerifierId,
        );
      } catch (error) {
        console.log('accelerateReq error', error);
      }
    }

    if (req && !req.error) {
      CommonToast.success('Guardians Added');
      myEvents.refreshGuardiansList.emit();
      if (!accelerateChainId) {
        navigationService.navigate('GuardianHome');
      } else {
        if ([LoginType.Email, LoginType.Phone].includes(guardianItem.guardianType)) {
          navigationService.pop(3);
        } else {
          navigationService.pop(2);
        }
      }
    } else {
      CommonToast.fail(req?.error?.message || '');
    }
    Loading.hide();
  }, [
    accelerateChainId,
    caHash,
    getCAContract,
    getCurrentCAContract,
    guardianItem,
    guardiansStatus,
    managerAddress,
    originChainId,
    t,
    userGuardiansList,
    verifierInfo,
    randomVerifierId,
  ]);

  const onDeleteGuardian = useCallback(async () => {
    if (!managerAddress || !caHash || !guardianItem || !userGuardiansList || !guardiansStatus) return;
    Loading.show({ text: t('Processing on the chain...') });
    try {
      const caContract = await getCurrentCAContract();
      const req = await deleteGuardian(
        caContract,
        managerAddress,
        caHash,
        guardianItem,
        userGuardiansList,
        guardiansStatus,
      );
      if (req && !req.error) {
        myEvents.refreshGuardiansList.emit();
        navigationService.navigate('GuardianHome');
      } else {
        CommonToast.fail(req?.error?.message || '');
      }
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [caHash, getCurrentCAContract, guardianItem, guardiansStatus, managerAddress, t, userGuardiansList]);

  const onEditGuardian = useCallback(async () => {
    if (!managerAddress || !caHash || !preGuardian || !guardianItem || !userGuardiansList || !guardiansStatus) return;
    Loading.show({ text: t('Processing on the chain...') });
    try {
      const caContract = await getCurrentCAContract();
      const req = await editGuardian(
        caContract,
        managerAddress,
        caHash,
        preGuardian,
        guardianItem,
        userGuardiansList,
        guardiansStatus,
      );
      if (req && !req.error) {
        dispatch(setPreGuardianAction(undefined));
        myEvents.refreshGuardiansList.emit();
        navigationService.navigate('GuardianHome');
      } else {
        CommonToast.fail(req?.error?.message || '');
      }
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [
    caHash,
    dispatch,
    getCurrentCAContract,
    guardianItem,
    guardiansStatus,
    managerAddress,
    preGuardian,
    t,
    userGuardiansList,
  ]);

  const onRemoveOtherManager = useCallback(async () => {
    if (!removeManagerAddress || !caHash || !guardiansStatus || !userGuardiansList) return;
    Loading.show();
    try {
      const caContract = await getCurrentCAContract();
      const req = await removeOtherManager(
        caContract,
        removeManagerAddress,
        caHash,
        userGuardiansList,
        guardiansStatus,
      );
      if (req && !req.error) {
        await sleep(1000);
        CommonToast.success('Device Deleted');
        myEvents.refreshDeviceList.emit();
        navigationService.navigate('DeviceList');
      } else {
        CommonToast.fail(req?.error?.message || '');
      }
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [caHash, getCurrentCAContract, guardiansStatus, removeManagerAddress, userGuardiansList]);

  const onModifyTransferLimit = useCallback(async () => {
    if (!transferLimitDetail || !managerAddress || !caHash || !guardiansStatus || !userGuardiansList) return;
    Loading.show();
    try {
      const caContract = await getCurrentCAContract();
      const req = await modifyTransferLimit(
        caContract,
        managerAddress,
        caHash,
        userGuardiansList,
        guardiansStatus,
        transferLimitDetail,
      );
      if (req && !req.error) {
        const isPaymentSecurityDetailExist = checkRouteExistInRouteStack('PaymentSecurityDetail');
        updateTransferLimit(transferLimitDetail);
        if (isPaymentSecurityDetailExist) {
          await sleep(1000);
        }
        CommonToast.success('Saved Successful');

        if (isPaymentSecurityDetailExist) {
          navigationService.navigate('PaymentSecurityDetail', {
            transferLimitDetail,
          });
        } else {
          navigationService.pop(2);
        }
      } else {
        console.log('onModifyTransferLimit: req?.error?.message', req?.error?.message);
        CommonToast.failError(req?.error?.message || '');
      }
    } catch (error) {
      console.log('onModifyTransferLimit: error', error);
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [
    caHash,
    checkRouteExistInRouteStack,
    getCurrentCAContract,
    guardiansStatus,
    managerAddress,
    transferLimitDetail,
    updateTransferLimit,
    userGuardiansList,
  ]);

  const getTransferFee = useGetTransferFee();
  const onTransferApprove = useCallback(async () => {
    if (!guardiansStatus || !userGuardiansList) return;
    const guardiansApproved = getGuardiansApproved(userGuardiansList, guardiansStatus);

    if (successNavigate) {
      navigationService.pop(1);
      navigationService.navigate(successNavigate.name, {
        ...successNavigate.params,
        guardiansApproved,
      });
      return;
    }
    if (sendTransferPreviewApprove) {
      const previewParams = sendTransferPreviewApprove.params;
      const { assetInfo } = previewParams;
      const isCross = isCrossChain(assetInfo.chainId, previewParams.toInfo.chainId || 'AELF');
      const caContract = await getCAContract(assetInfo.chainId);

      let transferFee: string | undefined;
      try {
        transferFee = await getTransferFee({
          isCross,
          sendAmount: `${previewParams.sendNumber}`,
          decimals: assetInfo.decimals,
          symbol: assetInfo.symbol,
          caContract,
          tokenContractAddress: assetInfo.tokenContractAddress,
          toAddress: previewParams.toInfo.address,
          chainId: assetInfo.chainId,
        });
      } catch (error) {
        console.log('approve getTransferFee error', error);
      }

      navigationService.pop(1);
      navigationService.navigate(sendTransferPreviewApprove.successNavigateName, {
        ...sendTransferPreviewApprove.params,
        guardiansApproved,
        transactionFee: transferFee || '0',
      });
      return;
    }
  }, [getCAContract, getTransferFee, guardiansStatus, sendTransferPreviewApprove, successNavigate, userGuardiansList]);
  const onSetLoginAccount = useCallback(async () => {
    if (!managerAddress || !caHash || !verifierInfo || !guardianItem || !guardiansStatus || !userGuardiansList) return;
    Loading.show({ text: t('Processing on the chain...') });
    try {
      const caContract = await getCurrentCAContract();
      const req = await setLoginAccount(
        caContract,
        managerAddress,
        caHash,
        verifierInfo,
        guardianItem,
        userGuardiansList,
        guardiansStatus,
      );

      if (req && !req.error) {
        myEvents.refreshGuardiansList.emit();
        myEvents.setLoginAccount.emit({
          guardian: {
            ...guardianItem,
            isLoginAccount: true,
          },
        });
        if (setLoginAccountNavigate) {
          navigationService.navigate(setLoginAccountNavigate.from, setLoginAccountNavigate.successParams);
        } else {
          navigationService.navigate('GuardianHome');
        }
      } else {
        CommonToast.fail(req?.error?.message || '');
      }
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [
    caHash,
    getCurrentCAContract,
    guardianItem,
    guardiansStatus,
    managerAddress,
    setLoginAccountNavigate,
    t,
    userGuardiansList,
    verifierInfo,
  ]);

  const onUnsetLoginAccount = useCallback(async () => {
    if (!managerAddress || !caHash || !verifierInfo || !guardianItem || !guardiansStatus || !userGuardiansList) return;
    Loading.show({ text: t('Processing on the chain...') });
    try {
      const caContract = await getCurrentCAContract();
      const req = await unsetLoginAccount(
        caContract,
        managerAddress,
        caHash,
        verifierInfo,
        guardianItem,
        userGuardiansList,
        guardiansStatus,
      );
      if (req && !req.error) {
        const { identifierHash } = guardianItem;
        try {
          await reportUnsetLoginAccount({
            caHash,
            unsetGuardianIdentifierHash: identifierHash,
            chainId: originChainId,
          });
        } catch (ignored) {}
        myEvents.refreshGuardiansList.emit();
        myEvents.setLoginAccount.emit({
          guardian: {
            ...guardianItem,
            isLoginAccount: false,
          },
        });
        if (setLoginAccountNavigate) {
          navigationService.navigate(setLoginAccountNavigate.from, setLoginAccountNavigate.successParams);
        } else {
          navigationService.navigate('GuardianHome');
        }
      } else {
        CommonToast.fail(req?.error?.message || '');
      }
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [
    caHash,
    getCurrentCAContract,
    guardianItem,
    guardiansStatus,
    managerAddress,
    originChainId,
    reportUnsetLoginAccount,
    setLoginAccountNavigate,
    t,
    userGuardiansList,
    verifierInfo,
  ]);

  const onFinish = useCallback(async () => {
    switch (approvalType) {
      case ApprovalType.communityRecovery:
        registerAccount();
        break;
      case ApprovalType.addGuardian:
        lastOnEmitDapp.current();
        onAddGuardian();
        break;
      case ApprovalType.setLoginAccount:
        onSetLoginAccount();
        break;
      case ApprovalType.unsetLoginAccount:
        onUnsetLoginAccount();
        break;
      case ApprovalType.deleteGuardian:
        onDeleteGuardian();
        break;
      case ApprovalType.editGuardian:
        onEditGuardian();
        break;
      case ApprovalType.removeOtherManager:
        onRemoveOtherManager();
        break;
      case ApprovalType.managerApprove:
        dappApprove();
        break;
      case ApprovalType.modifyTransferLimit:
        onModifyTransferLimit();
        break;
      case ApprovalType.transferApprove:
        onTransferApprove();
        break;
      default:
        break;
    }
  }, [
    approvalType,
    registerAccount,
    lastOnEmitDapp,
    onAddGuardian,
    onSetLoginAccount,
    onUnsetLoginAccount,
    onDeleteGuardian,
    onEditGuardian,
    onRemoveOtherManager,
    dappApprove,
    onModifyTransferLimit,
    onTransferApprove,
  ]);
  const extra = useMemo(() => {
    const extraObj: any = {};
    switch (approvalType) {
      case ApprovalType.communityRecovery:
        extraObj.verifyManagerAddress = latestVerifyManagerAddress.current;
        break;
      case ApprovalType.addGuardian:
        extraObj.identifierHash = guardianItem?.identifierHash;
        extraObj.guardianType = guardianItem?.guardianType + '';
        extraObj.verifierId = guardianItem?.verifier?.id || '' + '';
        break;
      case ApprovalType.setLoginAccount:
        extraObj.identifierHash = guardianItem?.identifierHash;
        extraObj.guardianType = guardianItem?.guardianType + '';
        extraObj.verifierId = guardianItem?.verifier?.id || '' + '';
        break;
      case ApprovalType.unsetLoginAccount:
        extraObj.identifierHash = guardianItem?.identifierHash;
        extraObj.guardianType = guardianItem?.guardianType + '';
        extraObj.verifierId = guardianItem?.verifier?.id || '' + '';
        break;
      case ApprovalType.deleteGuardian:
        extraObj.identifierHash = guardianItem?.identifierHash;
        extraObj.guardianType = guardianItem?.guardianType + '';
        extraObj.verifierId = guardianItem?.verifier?.id || '' + '';
        break;
      case ApprovalType.editGuardian:
        extraObj.identifierHash = guardianItem?.identifierHash;
        extraObj.guardianType = guardianItem?.guardianType + '';
        extraObj.preVerifierId = guardianItem?.verifierId + '';
        extraObj.newVerifierId = guardianItem?.verifier?.id || '' + '';
        break;
      case ApprovalType.managerApprove:
        extraObj.spender = approveParams?.approveInfo?.spender || '';
        extraObj.amount = approveParams?.approveInfo?.amount || '';
        extraObj.symbol = approveParams?.approveInfo?.symbol + '';
        break;
      case ApprovalType.modifyTransferLimit:
        extraObj.singleLimit = transferLimitDetail?.singleLimit;
        extraObj.dailyLimit = transferLimitDetail?.dailyLimit + '';
        extraObj.symbol = transferLimitDetail?.symbol + '';
        break;
      case ApprovalType.transferApprove:
        extraObj.toAddress = sendTransferPreviewApprove?.params.toInfo.address || '';
        extraObj.amount =
          timesDecimals(
            sendTransferPreviewApprove?.params.sendNumber,
            sendTransferPreviewApprove?.params?.assetInfo?.decimals,
          ) + '';
        extraObj.symbol = sendTransferPreviewApprove?.params?.assetInfo.symbol + '';
        break;
      default:
        break;
    }
    return extraObj;
  }, [
    approvalType,
    approveParams?.approveInfo?.amount,
    approveParams?.approveInfo?.spender,
    approveParams?.approveInfo?.symbol,
    guardianItem?.guardianType,
    guardianItem?.identifierHash,
    guardianItem?.verifier?.id,
    guardianItem?.verifierId,
    latestVerifyManagerAddress,
    sendTransferPreviewApprove?.params?.assetInfo?.decimals,
    sendTransferPreviewApprove?.params?.assetInfo.symbol,
    sendTransferPreviewApprove?.params.sendNumber,
    sendTransferPreviewApprove?.params.toInfo.address,
    transferLimitDetail?.dailyLimit,
    transferLimitDetail?.singleLimit,
    transferLimitDetail?.symbol,
  ]);

  const onTryAgain = useCallback(() => {
    setIsExpired(false);
    guardianExpiredTimeRef.current = undefined;
    setApproved({});
  }, []);

  return (
    <PageContainer
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.containerStyle}
      leftIconType="close"
      leftCallback={onBack}
      rightDom={<GuardianApproveTip />}
      titleDom
      hideTouchable>
      {isExpired ? (
        <GuardianExpired onTryAgain={onTryAgain} />
      ) : (
        <View style={GStyles.flex1}>
          <TextH1 style={styles.headerTitle}>Guardian approval</TextH1>
          <TextM style={styles.headerContent}>
            {'Complete the required guardian approvals below. Note: approvals expire after 1 hour.'}
          </TextM>
          <GuardianApproveProgress style={styles.progressWrap} amount={approvedAmount} length={guardianCount} />

          <View style={GStyles.flex1}>
            <ScrollView>
              <View style={styles.guardiansTitleWrap}>
                <TextM style={styles.guardiansTitle}>{'Login account(s)'}</TextM>
              </View>
              {loginGuardians?.map(item => {
                return (
                  <GuardianItem
                    key={item.key}
                    guardianItem={item}
                    setGuardianStatus={onSetGuardianStatus}
                    guardiansStatus={guardiansStatus}
                    isExpired={isExpired}
                    isSuccess={isSuccess}
                    approvalType={approvalType}
                    authenticationInfo={authenticationInfo}
                    targetChainId={targetChainId}
                    extra={extra}
                  />
                );
              })}
              <View style={styles.guardiansTitleWrap}>
                <TextM style={styles.guardiansTitle}>{'Other guardian(s)'}</TextM>
              </View>
              {otherGuardians?.map(item => {
                return (
                  <GuardianItem
                    key={item.key}
                    guardianItem={item}
                    setGuardianStatus={onSetGuardianStatus}
                    guardiansStatus={guardiansStatus}
                    isExpired={isExpired}
                    isSuccess={isSuccess}
                    approvalType={approvalType}
                    authenticationInfo={authenticationInfo}
                    targetChainId={targetChainId}
                    extra={extra}
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyle: {
    paddingTop: pTd(24),
    paddingBottom: pTd(16),
    justifyContent: 'space-between',
    paddingHorizontal: pTd(16),
  },
  headerTitle: {
    ...fonts.BGMediumFont,
  },
  headerContent: {
    marginTop: pTd(16),
    lineHeight: pTd(20),
    color: theme.colors.textBase2,
    marginBottom: pTd(24),
  },
  progressWrap: {
    marginBottom: pTd(16),
  },
  guardiansTitleWrap: {
    height: pTd(44),
    justifyContent: 'center',
  },
  guardiansTitle: {
    color: theme.colors.textBase2,
  },
}));
