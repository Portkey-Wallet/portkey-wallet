import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { TextL, TextM, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pageStyles } from './style';
import ListItem from 'components/ListItem';
import CommonInput from 'components/CommonInput';
import { checkEmail } from '@portkey-wallet/utils/check';
import { useGuardiansInfo } from 'hooks/store';
import { LOGIN_TYPE_LIST } from 'constants/misc';
import { PRIVATE_GUARDIAN_ACCOUNT } from '@portkey-wallet/constants/constants-ca/guardian';
import { ApprovalType, VerificationType, OperationTypeEnum, VerifierItem } from '@portkey-wallet/types/verifier';
import { INIT_HAS_ERROR, INIT_NONE_ERROR, ErrorType } from '@portkey-wallet/constants/constants-ca/common';
import GuardianTypeSelectOverlay from '../components/GuardianTypeSelectOverlay';
import VerifierSelectOverlay from '../components/VerifierSelectOverlay';
import ActionSheet from 'components/ActionSheet';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import useRouterParams, { useRouterEffectParams } from '@portkey-wallet/hooks/useRouterParams';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
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
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
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

type RouterParams = {
  guardian?: UserGuardianItem;
  isEdit?: boolean;
  accelerateChainId?: ChainId;
};

type thirdPartyInfoType = {
  id: string;
  accessToken: string;
};

type TypeItemType = typeof LOGIN_TYPE_LIST[number];

const GuardianEdit: React.FC = () => {
  const dispatch = useAppDispatch();
  const originChainId = useOriginChainId();
  const refreshGuardiansList = useRefreshGuardiansList();

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

  const verifyToken = useVerifyToken();
  const [firstName, setFirstName] = useState<string>();

  const thirdPartyInfoRef = useRef<thirdPartyInfoType>();
  const { approveParams } = useRouterParams<NavigateMultiLevelParams>();
  const isFocused = useIsFocused();
  const onEmitDapp = useCallback(() => {
    if (!isFocused) return;
    approveParams?.isDiscover && dispatch(changeDrawerOpenStatus(true));
  }, [approveParams, dispatch]);
  const lastOnEmitDapp = useLatestRef(onEmitDapp);

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
      setSelectedVerifier(verifierList.find(item => item.name === editGuardian?.verifier?.name));
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
      if (!selectedType) return false;

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

      if (guardiansList.find(item => item.verifier?.id === selectedVerifier?.id)) {
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
        verifierId: verifierInfo.id,
        chainId: originChainId,
        operationType: OperationTypeEnum.addGuardian,
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
    [verifyToken, originChainId, accelerateChainId],
  );

  const onConfirm = useCallback(async () => {
    if (selectedVerifier === undefined || selectedType === undefined) return;
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
    if (!isValid) return;

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
              if (![LoginType.Email, LoginType.Phone].includes(guardianType)) return;
              Loading.show();
              const req = await verification.sendVerificationCode({
                params: {
                  type: LoginType[guardianType],
                  guardianIdentifier: guardianAccount,
                  verifierId: selectedVerifier.id,
                  chainId: originChainId,
                  operationType: OperationTypeEnum.addGuardian,
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
    if (!isValid || !editGuardian || !selectedVerifier) return;

    Loading.show();
    const _userGuardiansList = await refreshGuardiansList();
    const isValid2 = checkCurGuardianRepeat(_userGuardiansList || []);
    Loading.hide();
    if (!isValid2) return;

    dispatch(setPreGuardianAction(editGuardian));
    navigationService.navigate('GuardianApproval', {
      approvalType: ApprovalType.editGuardian,
      guardianItem: {
        ...editGuardian,
        verifier: selectedVerifier,
      },
    });
  }, [checkCurGuardianRepeat, dispatch, editGuardian, refreshGuardiansList, selectedVerifier, userGuardiansList]);

  const setLoginAccount = useSetLoginAccount(true);
  const onRemove = useCallback(async () => {
    if (!editGuardian || !userGuardiansList) return;

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
          ? `This guardian is currently set as a login account. You need to unset its login account identity before removing it. Please click "Confirm" to proceed.`
          : undefined,
        message: isLoginAccount ? undefined : `Removing a guardian requires guardians' approval`,
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
    if (!result) return;

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
    },
    [clearAccount],
  );

  const onAppleSign = useCallback(async () => {
    Loading.show();
    let userInfo: TAppleAuthentication;
    try {
      userInfo = await appleSign();
      thirdPartyInfoRef.current = {
        id: userInfo.user.id,
        accessToken: userInfo.identityToken || '',
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
      if (!userInfo) return;
      setFirstName(userInfo.fullName?.givenName || undefined);
      if (userInfo.user.isPrivate) {
        setAccount(PRIVATE_GUARDIAN_ACCOUNT);
      } else {
        setAccount(userInfo.user.email);
      }
    }
    Loading.hide();
  }, [appleSign]);

  const onGoogleSign = useCallback(async () => {
    Loading.show();
    try {
      const userInfo = await googleSign();
      setAccount(userInfo.user.email);
      setFirstName(userInfo.user.givenName || undefined);
      thirdPartyInfoRef.current = {
        id: userInfo.user.id,
        accessToken: userInfo.accessToken,
      };
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [googleSign]);

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
          <TextM style={pageStyles.accountLabel}>Guardian {LoginType[editGuardian?.guardianType || 0]}</TextM>
          <GuardianAccountItem guardian={editGuardian} />
          <TextM>{guardianAccountError.errorMsg}</TextM>
        </View>
      );
    }

    if (!selectedType) return <></>;

    switch (selectedType.value) {
      case LoginType.Email:
        return (
          <CommonInput
            disabled={isEdit}
            type="general"
            theme="white-bg"
            label={'Guardian email'}
            value={account}
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
    return <></>;
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
  ]);

  const goBack = useCallback(() => {
    if (isEdit) return navigationService.navigate('GuardianHome');
    navigationService.goBack();
  }, [isEdit]);

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={isEdit ? 'Edit Guardians' : 'Add Guardians'}
      leftCallback={goBack}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.contentWrap}>
        {!isEdit && (
          <>
            <TextM style={pageStyles.titleLabel}>{'Guardian Type'}</TextM>
            <ListItem
              onPress={() => {
                GuardianTypeSelectOverlay.showList({
                  list: LOGIN_TYPE_LIST,
                  labelAttrName: 'name',
                  value: selectedType?.value,
                  callBack: onChooseType,
                });
              }}
              titleStyle={[GStyles.flexRowWrap, GStyles.itemCenter]}
              titleTextStyle={[pageStyles.titleTextStyle, !selectedType && FontStyles.font7]}
              style={pageStyles.typeWrap}
              titleLeftElement={
                selectedType?.icon && (
                  <View style={[GStyles.center, pageStyles.itemIconWrap]}>
                    <Svg icon={selectedType.icon} size={pTd(20)} />
                  </View>
                )
              }
              title={selectedType?.name || 'Select guardian types'}
              rightElement={<Svg size={pTd(20)} icon="down-arrow" />}
            />
          </>
        )}

        {renderGuardianAccount()}

        <TextM style={pageStyles.titleLabel}>{'Verifier'}</TextM>
        <ListItem
          onPress={() => {
            VerifierSelectOverlay.showList({
              id: selectedVerifier?.id,
              callBack: onChooseVerifier,
              editGuardian: editGuardian,
            });
          }}
          titleLeftElement={
            selectedVerifier && (
              <VerifierImage
                style={pageStyles.verifierImageStyle}
                size={pTd(30)}
                label={selectedVerifier.name}
                uri={selectedVerifier.imageUrl}
              />
            )
          }
          titleStyle={[GStyles.flexRowWrap, GStyles.itemCenter]}
          titleTextStyle={[pageStyles.titleTextStyle, !selectedVerifier && FontStyles.font7]}
          style={pageStyles.verifierWrap}
          title={selectedVerifier?.name || 'Select guardian verifiers'}
          rightElement={<Svg size={pTd(20)} icon="down-arrow" />}
        />
        {verifierError.isError && <TextS style={pageStyles.errorTips}>{verifierError.errorMsg || ''}</TextS>}
      </View>

      <View>
        {isEdit ? (
          <>
            <CommonButton disabled={isApprovalDisable} type="primary" onPress={onApproval}>
              {'Send Request'}
            </CommonButton>
            <CommonButton
              style={pageStyles.removeBtnWrap}
              type="clear"
              onPress={onRemove}
              titleStyle={FontStyles.font12}>
              {'Remove'}
            </CommonButton>
          </>
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
