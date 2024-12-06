import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { TextL, TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { getPageStyles } from './style';
import ListItem from 'components/ListItem';
import CommonInput from 'components/CommonInput';
import { checkEmail } from '@portkey-wallet/utils/check';
import { useGuardiansInfo } from 'hooks/store';
import { GUARDIAN_ITEM_TYPE_ICON, LOGIN_TYPE_LIST, T_LOGIN_TYPE_LIST_ITEM } from 'constants/misc';
import { PRIVATE_GUARDIAN_ACCOUNT } from '@portkey-wallet/constants/constants-ca/guardian';
import {
  ApprovalType,
  VerificationType,
  OperationTypeEnum,
  VerifierItem,
  zkLoginVerifierItem,
} from '@portkey-wallet/types/verifier';
import { INIT_HAS_ERROR, INIT_NONE_ERROR, ErrorType } from '@portkey-wallet/constants/constants-ca/common';
import GuardianTypeSelectOverlay from '../components/GuardianTypeSelectOverlay';
import VerifierSelectOverlay from '../components/VerifierSelectOverlay';
import ActionSheet from 'components/ActionSheet';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import useRouterParams, { useRouterEffectParams } from '@portkey-wallet/hooks/useRouterParams';
import { LoginType, isZKLoginSupported } from '@portkey-wallet/types/types-ca/wallet';
import { useAppDispatch } from 'store/hooks';
import { setPreGuardianAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { VerifierImage } from 'pages/Guardian/components/VerifierImage';
import { verification } from 'utils/api';
import PhoneInput from 'components/PhoneInput';
import {
  useAppleAuthentication,
  useFacebookAuthentication,
  useGoogleAuthentication,
  useTelegramAuthentication,
  useTwitterAuthentication,
  useVerifyToken,
} from 'hooks/authentication';
import GuardianAccountItem from '../components/GuardianAccountItem';
import { request } from '@portkey-wallet/api/api-did';
import verificationApiConfig from '@portkey-wallet/api/api-did/verification';
import { useOriginChainId, useVerifyManagerAddress } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { usePhoneCountryCode } from '@portkey-wallet/hooks/hooks-ca/misc';
import { checkIsLastLoginAccount } from '@portkey-wallet/utils/guardian';
import { ChainId } from '@portkey-wallet/types';
import { useRefreshGuardiansList } from 'hooks/guardian';
import GuardianThirdAccount from '../components/GuardianThirdAccount';
import { useSetLoginAccount } from '../hooks/useSetLoginAccount';
import { AuthTypes } from 'constants/guardian';
import { useEffectOnce, useLatestRef } from '@portkey-wallet/hooks';
import { NavigateMultiLevelParams } from 'types/navigate';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-ca/discover/slice';
import { useIsFocused } from '@react-navigation/native';
import { TAppleAuthentication } from 'types/authentication';
import { useLoginModeList } from 'hooks/loginMode';
import { LOGIN_TYPE_LABEL_MAP } from '@portkey-wallet/constants/verifier';
import { getOperationDetails } from '@portkey-wallet/utils/operation.util';
import Touchable from 'components/Touchable';
import { useTheme } from '@rneui/themed';
import CommonTooltip from 'components/CommonTooltip';

type RouterParams = {
  guardian?: UserGuardianItem;
  isEdit?: boolean;
  accelerateChainId?: ChainId;
};

type thirdPartyInfoType = {
  id: string;
  accessToken: string;
  idToken?: string;
  nonce?: string;
  timestamp?: number;
};

type TypeItemType = (typeof LOGIN_TYPE_LIST)[number];

const GuardianEdit: React.FC = () => {
  const dispatch = useAppDispatch();
  const originChainId = useOriginChainId();
  const refreshGuardiansList = useRefreshGuardiansList();
  const pageStyles = getPageStyles();
  const {
    theme: { colors },
  } = useTheme();

  const {
    guardian: editGuardian,
    isEdit = false,
    accelerateChainId = originChainId,
  } = useRouterEffectParams<RouterParams>();

  const { verifierMap, userGuardiansList } = useGuardiansInfo();
  const verifierList = useMemo(() => (verifierMap ? Object.values(verifierMap) : []), [verifierMap]);

  const [selectedType, setSelectedType] = useState<TypeItemType>();
  const [selectedVerifier, setSelectedVerifier] = useState<VerifierItem>();
  const [account, setAccount] = useState<string>();
  const [guardianAccountError, setGuardianAccountError] = useState<ErrorType>({ ...INIT_HAS_ERROR });
  const [verifierError, setVerifierError] = useState<ErrorType>({ ...INIT_NONE_ERROR });
  const { localPhoneCountryCode: country } = usePhoneCountryCode();
  const { appleSign } = useAppleAuthentication();
  const { googleSign } = useGoogleAuthentication();
  const { telegramSign } = useTelegramAuthentication();
  const { twitterSign } = useTwitterAuthentication();
  const { facebookSign } = useFacebookAuthentication();
  const verifyManagerAddress = useVerifyManagerAddress();

  const verifyToken = useVerifyToken();
  const [firstName, setFirstName] = useState<string>();
  const loginModeList = useLoginModeList();

  const thirdPartyInfoRef = useRef<thirdPartyInfoType>();
  const { approveParams } = useRouterParams<NavigateMultiLevelParams>();
  const isFocused = useIsFocused();
  const onEmitDapp = useCallback(() => {
    if (!isFocused) {
      return;
    }
    approveParams?.isDiscover && dispatch(changeDrawerOpenStatus(true));
  }, [approveParams?.isDiscover, dispatch, isFocused]);
  const lastOnEmitDapp = useLatestRef(onEmitDapp);
  const isSelectedVerifierDisabled = useMemo(() => {
    if (!selectedType) {
      return false;
    }
    if (isEdit) {
      return (
        isZKLoginSupported(selectedType.value) && (editGuardian?.verifiedByZk || editGuardian?.manuallySupportForZk)
      );
    } else {
      return isZKLoginSupported(selectedType.value);
    }
  }, [editGuardian, isEdit, selectedType]);

  useEffectOnce(() => {
    return () => {
      lastOnEmitDapp.current();
    };
  });

  useEffect(() => {
    if (editGuardian) {
      setSelectedType(LOGIN_TYPE_LIST.find(item => item.value === editGuardian?.guardianType));
      if (AuthTypes.includes(editGuardian.guardianType)) {
        setAccount(editGuardian.isPrivate ? PRIVATE_GUARDIAN_ACCOUNT : editGuardian.thirdPartyEmail);
      } else {
        setAccount(editGuardian.guardianAccount);
      }
      if (
        isZKLoginSupported(editGuardian?.guardianType) &&
        (editGuardian?.verifiedByZk || editGuardian?.manuallySupportForZk)
      ) {
        setSelectedVerifier({ ...zkLoginVerifierItem, id: editGuardian?.verifier?.id ?? '' });
      } else {
        setSelectedVerifier(verifierList.find(item => item.name === editGuardian?.verifier?.name));
      }
    }
  }, [editGuardian, verifierList]);

  const onAccountChange = useCallback((value: string) => {
    setAccount(value);
    setGuardianAccountError({ ...INIT_NONE_ERROR });
  }, []);

  const onChooseVerifier = useCallback((item: VerifierItem) => {
    setVerifierError({ ...INIT_NONE_ERROR });
    setSelectedVerifier(item);
  }, []);

  const checkCurGuardianRepeat = useCallback(
    (guardiansList: UserGuardianItem[]) => {
      if (!selectedType) {
        return false;
      }
      const totalUserGuardiansList = guardiansList.slice(0);

      if (isEdit) {
        guardiansList = guardiansList.filter(guardian => guardian.key !== editGuardian?.key);
      }
      let isValid = true;
      let guardianAccount: string | undefined;
      if ([LoginType.Email, LoginType.Phone].includes(selectedType.value)) {
        if (selectedType.value === LoginType.Phone && !isEdit) {
          guardianAccount = `+${country?.code}${account}`;
        } else {
          guardianAccount = account;
        }
      } else {
        // LoginType.Apple & LoginType.Google & LoginType.Telegram
        guardianAccount = isEdit ? editGuardian?.guardianAccount : thirdPartyInfoRef.current?.id;
      }

      if (
        guardiansList.find(
          item => item.guardianType === selectedType?.value && item.guardianAccount === guardianAccount,
        )
      ) {
        isValid = false;
        setGuardianAccountError({ ...INIT_HAS_ERROR, errorMsg: 'This account already exists. Please use others.' });
      } else {
        setGuardianAccountError({ ...INIT_NONE_ERROR });
      }

      const guardianRepeatList = totalUserGuardiansList.filter(
        item =>
          item.key !== editGuardian?.key &&
          !(isZKLoginSupported(item.guardianType) && (item.verifiedByZk || item.manuallySupportForZk)),
      );

      if (guardianRepeatList.find(item => item.verifier?.id === selectedVerifier?.id)) {
        isValid = false;
        setVerifierError({
          ...INIT_HAS_ERROR,
          errorMsg: 'This verifier has already been used. Please select from others.',
        });
      } else {
        setVerifierError({ ...INIT_NONE_ERROR });
      }

      return isValid;
    },
    [account, country?.code, editGuardian, isEdit, selectedType, selectedVerifier?.id],
  );

  const thirdPartyConfirm = useCallback(
    async (
      guardianAccount: string,
      thirdPartyInfo: thirdPartyInfoType,
      verifierInfo: VerifierItem,
      guardianType: LoginType,
    ) => {
      Loading.showOnce();
      const rst = await verifyToken(guardianType, {
        accessToken: thirdPartyInfo.accessToken,
        id: thirdPartyInfo.id,
        idToken: thirdPartyInfo.idToken,
        nonce: thirdPartyInfo.nonce,
        timestamp: thirdPartyInfo.timestamp,
        verifierId: verifierInfo.id,
        chainId: originChainId,
        operationType: OperationTypeEnum.addGuardian,
        operationDetails: getOperationDetails(OperationTypeEnum.addGuardian, {
          identifierHash: '',
          guardianType: guardianType + '',
          verifierId: selectedVerifier?.id || '',
        }),
      });
      Loading.hide();

      navigationService.navigate('GuardianApproval', {
        approvalType: ApprovalType.addGuardian,
        guardianItem: {
          isLoginAccount: false,
          verifier: verifierInfo,
          guardianAccount,
          guardianType,
        },
        verifierInfo: {
          ...rst,
          verifierId: verifierInfo.id,
        },
        verifiedTime: Date.now(),
        authenticationInfo: { [thirdPartyInfo.id]: thirdPartyInfo.accessToken },
        accelerateChainId,
      });
    },
    [verifyToken, originChainId, selectedVerifier?.id, accelerateChainId],
  );

  const onConfirm = useCallback(async () => {
    if (selectedVerifier === undefined || selectedType === undefined) {
      return;
    }
    const guardianType = selectedType.value;
    let guardianAccount = account;
    let showGuardianAccount;
    if (guardianType === LoginType.Phone) {
      guardianAccount = `+${country.code}${account}`;
      showGuardianAccount = `+${country.code} ${account}`;
    }
    if (guardianType === LoginType.Email) {
      const guardianErrorMsg = checkEmail(account);
      if (guardianErrorMsg) {
        setGuardianAccountError({
          isError: true,
          errorMsg: guardianErrorMsg,
        });
        setVerifierError({ ...INIT_NONE_ERROR });
        return;
      }
    }

    const isValid = checkCurGuardianRepeat(userGuardiansList || []);
    if (!isValid) {
      return;
    }

    Loading.showOnce();
    const _userGuardiansList = await refreshGuardiansList();
    const isValid2 = checkCurGuardianRepeat(_userGuardiansList || []);
    if (!isValid2) {
      Loading.hide();
      return;
    }

    if (AuthTypes.includes(guardianType)) {
      if (!thirdPartyInfoRef.current) {
        Loading.hide();
        return;
      }
      try {
        await thirdPartyConfirm(guardianAccount || '', thirdPartyInfoRef.current, selectedVerifier, guardianType);
      } catch (error) {
        CommonToast.failError(error);
      }
      Loading.hide();
      return;
    }
    Loading.hide();

    ActionSheet.alert({
      title2: (
        <Text>
          <TextL>{`${selectedVerifier.name} will send a verification code to `}</TextL>
          <TextL style={FontStyles.weight500}>{showGuardianAccount || guardianAccount}</TextL>
          <TextL>{` to verify your ${guardianType === LoginType.Phone ? 'phone number' : 'email address'}.`}</TextL>
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
              if (![LoginType.Email, LoginType.Phone].includes(guardianType)) {
                return;
              }
              Loading.show();
              const req = await verification.sendVerificationCode({
                params: {
                  type: LoginType[guardianType],
                  guardianIdentifier: guardianAccount,
                  verifierId: selectedVerifier.id,
                  chainId: originChainId,
                  operationType: OperationTypeEnum.addGuardian,
                  operationDetails: getOperationDetails(OperationTypeEnum.addGuardian, {
                    identifierHash: '',
                    guardianType: guardianType + '',
                    verifierId: selectedVerifier.id,
                  }),
                },
              });
              if (req.verifierSessionId) {
                navigationService.navigate('VerifierDetails', {
                  guardianItem: {
                    isLoginAccount: false,
                    verifier: selectedVerifier,
                    guardianAccount,
                    guardianType: guardianType,
                  },
                  requestCodeResult: {
                    verifierSessionId: req.verifierSessionId,
                  },
                  verificationType: VerificationType.addGuardian,
                  operationDetails: getOperationDetails(OperationTypeEnum.addGuardian, {
                    identifierHash: '',
                    guardianType: guardianType + '',
                    verifierId: selectedVerifier.id,
                  }),
                  accelerateChainId,
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
  }, [
    selectedVerifier,
    selectedType,
    account,
    checkCurGuardianRepeat,
    userGuardiansList,
    refreshGuardiansList,
    country.code,
    thirdPartyConfirm,
    originChainId,
    accelerateChainId,
  ]);

  const onApproval = useCallback(async () => {
    const isValid = checkCurGuardianRepeat(userGuardiansList || []);
    if (!isValid || !editGuardian || !selectedVerifier) {
      return;
    }

    Loading.show();
    const _userGuardiansList = await refreshGuardiansList();
    const isValid2 = checkCurGuardianRepeat(_userGuardiansList || []);
    Loading.hide();
    if (!isValid2) {
      return;
    }

    dispatch(setPreGuardianAction(editGuardian));
    // if the selectedVerifier is zkLoginVerifierItem, then the verifierId should be the original verifierId of the editGuardian
    const verifierId = selectedVerifier.id ? selectedVerifier.id : editGuardian?.verifier?.id;
    navigationService.navigate('GuardianApproval', {
      approvalType: ApprovalType.editGuardian,
      guardianItem: {
        ...editGuardian,
        verifier: { ...selectedVerifier, id: verifierId },
      },
    });
  }, [checkCurGuardianRepeat, dispatch, editGuardian, refreshGuardiansList, selectedVerifier, userGuardiansList]);

  const setLoginAccount = useSetLoginAccount(true);
  const onRemove = useCallback(async () => {
    if (!editGuardian || !userGuardiansList) {
      return;
    }

    const isLastLoginAccount = checkIsLastLoginAccount(userGuardiansList, editGuardian);

    if (isLastLoginAccount) {
      ActionSheet.alert({
        title2: 'This guardian is the only login account and cannot be removed',
        buttons: [
          {
            title: 'OK',
          },
        ],
      });
      return;
    }

    const isLoginAccount = editGuardian.isLoginAccount;
    const result = await new Promise(resolve => {
      ActionSheet.alert({
        title: isLoginAccount ? undefined : 'Are you sure you want to remove this guardian?',
        title2: isLoginAccount
          ? 'This guardian is currently set as a login account. You need to unset its login account identity before removing it. Please click "Confirm" to proceed.'
          : undefined,
        message: isLoginAccount ? undefined : "Removing a guardian requires guardians' approval",
        buttons: [
          {
            title: isLoginAccount ? 'Cancel' : 'Close',
            type: 'outline',
            onPress: () => resolve(false),
          },
          {
            title: isLoginAccount ? 'Confirm' : 'Send Request',
            onPress: () => resolve(true),
          },
        ],
      });
    });
    if (!result) {
      return;
    }

    if (!isLoginAccount) {
      navigationService.navigate('GuardianApproval', {
        approvalType: ApprovalType.deleteGuardian,
        guardianItem: editGuardian,
      });
      return;
    }

    setLoginAccount(editGuardian, false);
  }, [editGuardian, setLoginAccount, userGuardiansList]);

  const isConfirmDisable = useMemo(
    () => !selectedVerifier || !selectedType || !account,
    [account, selectedType, selectedVerifier],
  );

  const isApprovalDisable = useMemo(
    () => selectedVerifier?.id === editGuardian?.verifier?.id,
    [editGuardian, selectedVerifier],
  );

  const clearAccount = useCallback(() => {
    setAccount(undefined);
    setFirstName(undefined);
    thirdPartyInfoRef.current = undefined;
    setGuardianAccountError({ ...INIT_NONE_ERROR });
  }, []);
  const onChooseType = useCallback(
    (_type: TypeItemType) => {
      setSelectedType(_type);
      clearAccount();
      if (isZKLoginSupported(_type.value)) {
        setSelectedVerifier(zkLoginVerifierItem);
      } else if (selectedVerifier?.id === zkLoginVerifierItem.id) {
        setSelectedVerifier(undefined);
      }
    },
    [clearAccount, selectedVerifier?.id],
  );

  const onAppleSign = useCallback(async () => {
    Loading.show();
    let userInfo: TAppleAuthentication;
    try {
      userInfo = await appleSign(verifyManagerAddress ?? '');
      thirdPartyInfoRef.current = {
        id: userInfo.user.id,
        accessToken: userInfo.identityToken || '',
        idToken: userInfo.idToken,
        nonce: userInfo.nonce,
        timestamp: userInfo.timestamp,
      };
    } catch (error) {
      CommonToast.failError(error);
      Loading.hide();
      return;
    }

    Loading.show();
    try {
      const appleUserExtraInfo: {
        email: string;
        firstName: string | null;
        fullName: string | null;
        guardianType: string;
        id: string;
        isPrivate: boolean;
        lastName: string | null;
      } = await request.verify.getAppleUserExtraInfo({
        url: `${verificationApiConfig.getAppleUserExtraInfo.target}/${userInfo.user.id}`,
      });

      setFirstName(appleUserExtraInfo.firstName || undefined);
      if (appleUserExtraInfo.isPrivate) {
        setAccount(PRIVATE_GUARDIAN_ACCOUNT);
      } else {
        setAccount(appleUserExtraInfo.email || PRIVATE_GUARDIAN_ACCOUNT);
      }
    } catch (error) {
      if (!userInfo) {
        return;
      }
      setFirstName(userInfo.fullName?.givenName || undefined);
      if (userInfo.user.isPrivate) {
        setAccount(PRIVATE_GUARDIAN_ACCOUNT);
      } else {
        setAccount(userInfo.user.email);
      }
    }
    Loading.hide();
  }, [appleSign, verifyManagerAddress]);

  const onGoogleSign = useCallback(async () => {
    Loading.show();
    try {
      const userInfo = await googleSign(verifyManagerAddress ?? '');
      setAccount(userInfo.user.email);
      setFirstName(userInfo.user.givenName || undefined);
      thirdPartyInfoRef.current = {
        id: userInfo.user.id,
        accessToken: userInfo.accessToken,
        idToken: userInfo.idToken,
        nonce: userInfo.nonce,
        timestamp: userInfo.timestamp,
      };
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [googleSign, verifyManagerAddress]);

  const onTelegramSign = useCallback(async () => {
    Loading.show();
    try {
      const userInfo = await telegramSign();
      setAccount(PRIVATE_GUARDIAN_ACCOUNT);
      setFirstName(userInfo.user.firstName || undefined);
      thirdPartyInfoRef.current = {
        id: userInfo.user.id,
        accessToken: userInfo.accessToken,
      };
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [telegramSign]);

  const onTwitterSign = useCallback(async () => {
    Loading.show();
    try {
      const userInfo = await twitterSign();
      setAccount(PRIVATE_GUARDIAN_ACCOUNT);
      setFirstName(userInfo.user.name || undefined);
      thirdPartyInfoRef.current = {
        id: userInfo.user.id,
        accessToken: userInfo.accessToken,
      };
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [twitterSign]);
  const onFacebookSign = useCallback(async () => {
    Loading.show();
    try {
      const userInfo = await facebookSign();
      setAccount(PRIVATE_GUARDIAN_ACCOUNT);
      setFirstName(userInfo.user.firstName || undefined);
      thirdPartyInfoRef.current = {
        id: userInfo.user.id,
        accessToken: userInfo.accessToken,
      };
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [facebookSign]);

  const renderGuardianAccount = useCallback(() => {
    if (isEdit) {
      return (
        <View style={pageStyles.accountWrap}>
          <TextL style={pageStyles.accountLabel}>Guardian {LoginType[editGuardian?.guardianType || 0]}</TextL>
          <GuardianAccountItem guardian={editGuardian} />
          {guardianAccountError.errorMsg && <TextM>{guardianAccountError.errorMsg}</TextM>}
        </View>
      );
    }

    if (!selectedType) {
      return null;
    }

    switch (selectedType.value) {
      case LoginType.Email:
        return (
          <CommonInput
            disabled={isEdit}
            type="general"
            theme="black-bg"
            label={'Guardian email'}
            value={account}
            allowClear
            placeholder={'Enter email'}
            onChangeText={onAccountChange}
            errorMessage={guardianAccountError.isError ? guardianAccountError.errorMsg : ''}
            keyboardType="email-address"
          />
        );
      case LoginType.Phone:
        return (
          <PhoneInput
            label={'Guardian Phone'}
            theme="white-bg"
            value={account}
            errorMessage={guardianAccountError.isError ? guardianAccountError.errorMsg : ''}
            onChangeText={onAccountChange}
            selectCountry={country}
          />
        );
      case LoginType.Google:
        return (
          <GuardianThirdAccount
            account={account}
            firstName={firstName}
            clearAccount={clearAccount}
            guardianAccountError={guardianAccountError}
            onPress={onGoogleSign}
            type={LoginType.Google}
          />
        );

      case LoginType.Apple:
        return (
          <GuardianThirdAccount
            account={account}
            firstName={firstName}
            clearAccount={clearAccount}
            guardianAccountError={guardianAccountError}
            onPress={onAppleSign}
            type={LoginType.Apple}
          />
        );
      case LoginType.Telegram:
        return (
          <GuardianThirdAccount
            account={account}
            firstName={firstName}
            clearAccount={clearAccount}
            guardianAccountError={guardianAccountError}
            onPress={onTelegramSign}
            type={LoginType.Telegram}
          />
        );
      case LoginType.Twitter:
        return (
          <GuardianThirdAccount
            account={account}
            firstName={firstName}
            clearAccount={clearAccount}
            guardianAccountError={guardianAccountError}
            onPress={onTwitterSign}
            type={LoginType.Twitter}
          />
        );
      case LoginType.Facebook:
        return (
          <GuardianThirdAccount
            account={account}
            firstName={firstName}
            clearAccount={clearAccount}
            guardianAccountError={guardianAccountError}
            onPress={onFacebookSign}
            type={LoginType.Facebook}
          />
        );
      default:
        break;
    }
    return null;
  }, [
    account,
    clearAccount,
    country,
    editGuardian,
    firstName,
    guardianAccountError,
    isEdit,
    onAccountChange,
    onAppleSign,
    onGoogleSign,
    onTelegramSign,
    onFacebookSign,
    onTwitterSign,
    selectedType,
    pageStyles,
  ]);
  const goBack = useCallback(() => {
    if (isEdit) {
      return navigationService.navigate('GuardianHome');
    }
    navigationService.goBack();
  }, [isEdit]);

  const selectGuardianList = useMemo(() => {
    return loginModeList
      ?.map(i => LOGIN_TYPE_LIST.find(v => LOGIN_TYPE_LABEL_MAP[v.value] === i.type?.value))
      .filter(i => !!i) as T_LOGIN_TYPE_LIST_ITEM[];
  }, [loginModeList]);
  const isEditGuardianZKLoginSupported = useMemo(() => {
    return editGuardian && isZKLoginSupported(editGuardian.guardianType);
  }, [editGuardian]);
  const disabledMap = useMemo(() => {
    if (!userGuardiansList) {
      return {};
    }
    // The verification between ZK and non-ZK is independent.
    const guardianList = userGuardiansList.filter(
      item =>
        item.key !== editGuardian?.key &&
        !(isZKLoginSupported(item.guardianType) && (item.verifiedByZk || item.manuallySupportForZk)),
    );
    const map: Record<string, boolean> = {};
    // has selected by user, so disable them
    // editGuardian is able
    guardianList.forEach(item => {
      map[item.verifier?.id || ''] = true;
    });
    if (editGuardian && isZKLoginSupported(editGuardian.guardianType)) {
      // support zk, so disable all verifier except zkLogin
      verifierList.forEach(item => {
        if (item.id !== zkLoginVerifierItem.id) {
          map[item.id] = true;
        } else {
          map[item.id] = false;
        }
      });
    } else {
      map[zkLoginVerifierItem.id] = true;
    }
    return map;
  }, [editGuardian, userGuardiansList, verifierList]);

  const selectAbleVerifierList = useMemo(() => {
    return verifierList.filter(item => !disabledMap[item.id]);
  }, [verifierList, disabledMap]);
  const isEmptySelectAbleVerifierList = useMemo(() => {
    return !selectAbleVerifierList.length && !selectedVerifier;
  }, [selectAbleVerifierList, selectedVerifier]);

  return (
    <PageContainer
      safeAreaColor={['black', 'black']}
      titleDom={isEdit ? 'Edit Guardians' : 'Add Guardians'}
      leftCallback={goBack}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}
      rightDom={
        isEdit ? (
          <Touchable style={{ paddingRight: pTd(16) }} onPress={onRemove}>
            <Svg icon="remove" size={pTd(24)} />
          </Touchable>
        ) : null
      }>
      <View style={pageStyles.contentWrap}>
        {!isEdit && (
          <>
            <TextL style={[pageStyles.titleLabel, pageStyles.formItemLabelWrap]}>{'Guardian Type'}</TextL>
            <ListItem
              onPress={() => {
                GuardianTypeSelectOverlay.showList({
                  list: selectGuardianList,
                  labelAttrName: 'name',
                  value: selectedType?.value,
                  callBack: onChooseType,
                });
              }}
              titleStyle={[pageStyles.selectListTitleStyle]}
              titleTextStyle={[pageStyles.titleTextStyle, !selectedType && pageStyles.notSelectedTitleStyle]}
              style={pageStyles.typeWrap}
              titleLeftElement={
                selectedType?.icon && (
                  <View style={[GStyles.center, pageStyles.itemIconWrap]}>
                    <Svg icon={GUARDIAN_ITEM_TYPE_ICON[selectedType.value]} size={pTd(16)} />
                  </View>
                )
              }
              title={selectedType?.name || 'Select guardian types'}
              rightElement={<Svg size={pTd(20)} icon="down-arrow" />}
            />
          </>
        )}

        {renderGuardianAccount()}
        <View style={pageStyles.formItemLabelWrap}>
          <TextL style={pageStyles.titleLabel}>{'Verifier'}</TextL>
          <CommonTooltip
            iconSize={pTd(16)}
            tooltipProps={{
              title: 'Guardian verifier',
              description:
                "Verifiers are external services that boost security and decentralization in Portkey's social recovery system. Note: Used verifiers can't be selected again, except for zkLogin. For zkLogin, your guardian must be a Google account or Apple ID.",
            }}
          />
        </View>
        <ListItem
          onPress={() => {
            if (isSelectedVerifierDisabled || isEmptySelectAbleVerifierList) {
              return;
            }
            VerifierSelectOverlay.showList({
              id: selectedVerifier?.id,
              callBack: onChooseVerifier,
              editGuardian: editGuardian,
              list: selectAbleVerifierList,
              disabledMap,
            });
          }}
          titleLeftElement={
            selectedVerifier && (
              <VerifierImage
                style={pageStyles.verifierImageStyle}
                size={pTd(16)}
                label={selectedVerifier.name}
                uri={selectedVerifier.imageUrl}
              />
            )
          }
          titleStyle={[pageStyles.selectListTitleStyle]}
          titleTextStyle={[
            pageStyles.titleTextStyle,
            !selectedVerifier && pageStyles.notSelectedTitleStyle,
            (isSelectedVerifierDisabled || isEmptySelectAbleVerifierList) && { color: colors.textDisabled1 },
          ]}
          style={[
            pageStyles.verifierWrap,
            isSelectedVerifierDisabled || isEmptySelectAbleVerifierList
              ? {
                  backgroundColor: colors.bgBase2,
                  borderColor: colors.bgBase3,
                  borderWidth: StyleSheet.hairlineWidth,
                }
              : { backgroundColor: colors.bgBase1 },
          ]}
          title={selectedVerifier?.name || 'Select guardian verifiers'}
          rightElement={
            !(isSelectedVerifierDisabled || isEmptySelectAbleVerifierList) && (
              <Svg size={pTd(20)} icon="down-arrow" color={colors.iconBase1} />
            )
          }
        />
        {verifierError.isError && <TextL style={pageStyles.errorTips}>{verifierError.errorMsg || ''}</TextL>}
        {isEmptySelectAbleVerifierList && (
          <TextM style={pageStyles.warningTips}>{'All applicable verifiers have already been used.'}</TextM>
        )}
      </View>

      <View>
        {isEdit ? (
          !isEditGuardianZKLoginSupported && (
            <CommonButton disabled={isApprovalDisable} type="primary" onPress={onApproval}>
              {'Verify with guardian'}
            </CommonButton>
          )
        ) : (
          <CommonButton disabled={isConfirmDisable} type="primary" onPress={onConfirm}>
            {'Confirm'}
          </CommonButton>
        )}
      </View>
    </PageContainer>
  );
};

export default GuardianEdit;
