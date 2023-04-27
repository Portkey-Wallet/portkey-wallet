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
import { useLanguage } from 'i18n/hooks';
import CommonInput from 'components/CommonInput';
import { checkEmail } from '@portkey-wallet/utils/check';
import { useGuardiansInfo } from 'hooks/store';
import { LOGIN_TYPE_LIST } from '@portkey-wallet/constants/verifier';
import { PRIVATE_GUARDIAN_ACCOUNT } from '@portkey-wallet/constants/constants-ca/guardian';
import { ApprovalType, VerificationType, VerifierItem } from '@portkey-wallet/types/verifier';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import GuardianTypeSelectOverlay from '../components/GuardianTypeSelectOverlay';
import VerifierSelectOverlay from '../components/VerifierSelectOverlay';
import ActionSheet from 'components/ActionSheet';
import { ErrorType } from 'types/common';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useAppDispatch } from 'store/hooks';
import { setPreGuardianAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { VerifierImage } from 'pages/Guardian/components/VerifierImage';
import { verification } from 'utils/api';
import fonts from 'assets/theme/fonts';
import PhoneInput from 'components/PhoneInput';
import { CountryItem } from '@portkey-wallet/types/types-ca/country';
import { DefaultCountry } from '@portkey-wallet/constants/constants-ca/country';
import Touchable from 'components/Touchable';
import {
  AppleAuthentication,
  useAppleAuthentication,
  useGoogleAuthentication,
  useVerifyToken,
} from 'hooks/authentication';
import GuardianAccountItem from '../components/GuardianAccountItem';
import { request } from '@portkey-wallet/api/api-did';
import verificationApiConfig from '@portkey-wallet/api/api-did/verification';
import { DEVICE_TYPE } from 'constants/common';
import { DeviceType } from '@portkey-wallet/types/types-ca/device';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';

type RouterParams = {
  guardian?: UserGuardianItem;
  isEdit?: boolean;
};

type thirdPartyInfoType = {
  id: string;
  accessToken: string;
};

type TypeItemType = typeof LOGIN_TYPE_LIST[number];

const GuardianEdit: React.FC = () => {
  const { t, language } = useLanguage();
  const dispatch = useAppDispatch();
  const originChainId = useOriginChainId();

  const { guardian: editGuardian, isEdit = false } = useRouterParams<RouterParams>();

  const { verifierMap, userGuardiansList } = useGuardiansInfo();
  const verifierList = useMemo(() => (verifierMap ? Object.values(verifierMap) : []), [verifierMap]);

  const loginTypeList = useMemo(() => {
    if (DEVICE_TYPE !== DeviceType.ANDROID) return LOGIN_TYPE_LIST;
    return LOGIN_TYPE_LIST.filter(item => item.value !== LoginType.Apple);
  }, []);

  const [selectedType, setSelectedType] = useState<TypeItemType>();
  const [selectedVerifier, setSelectedVerifier] = useState<VerifierItem>();
  const [account, setAccount] = useState<string>();
  const [guardianTypeError, setGuardianTypeError] = useState<ErrorType>({ ...INIT_HAS_ERROR });
  const [guardianError, setGuardianError] = useState<ErrorType>({ ...INIT_NONE_ERROR });
  const [country, setCountry] = useState<CountryItem>(DefaultCountry);
  const { appleSign } = useAppleAuthentication();
  const { googleSign } = useGoogleAuthentication();
  const verifyToken = useVerifyToken();
  const [firstName, setFirstName] = useState<string>();

  const thirdPartyInfoRef = useRef<thirdPartyInfoType>();

  useEffect(() => {
    if (editGuardian) {
      setSelectedType(LOGIN_TYPE_LIST.find(item => item.value === editGuardian?.guardianType));
      if ([LoginType.Apple, LoginType.Google].includes(editGuardian.guardianType)) {
        setAccount(editGuardian.isPrivate ? PRIVATE_GUARDIAN_ACCOUNT : editGuardian.thirdPartyEmail);
      } else {
        setAccount(editGuardian.guardianAccount);
      }
      setSelectedVerifier(verifierList.find(item => item.name === editGuardian?.verifier?.name));
    }
  }, [editGuardian, verifierList]);

  const onAccountChange = useCallback((value: string) => {
    setAccount(value);
    setGuardianTypeError({ ...INIT_NONE_ERROR });
  }, []);

  const onChooseVerifier = useCallback((item: VerifierItem) => {
    setGuardianError({ ...INIT_NONE_ERROR });
    setSelectedVerifier(item);
  }, []);

  const checkCurGuardianRepeat = useCallback(() => {
    if (!selectedType) {
      return { ...INIT_HAS_ERROR };
    }
    if ([LoginType.Email, LoginType.Phone].includes(selectedType.value)) {
      let _account = account;

      if (selectedType.value === LoginType.Phone && !isEdit) {
        _account = `+${country?.code}${account}`;
      }

      if (
        userGuardiansList?.findIndex(
          guardian =>
            guardian.guardianType === selectedType?.value &&
            guardian.guardianAccount === _account &&
            guardian.verifier?.id === selectedVerifier?.id,
        ) !== -1
      ) {
        return { ...INIT_HAS_ERROR, errorMsg: t('This guardian already exists') };
      } else {
        return { ...INIT_NONE_ERROR };
      }
    }

    if ([LoginType.Apple, LoginType.Google].includes(selectedType.value)) {
      const guardianAccount = isEdit ? editGuardian?.guardianAccount : thirdPartyInfoRef.current?.id;
      if (
        userGuardiansList?.findIndex(
          guardian =>
            guardian.guardianType === selectedType?.value &&
            guardian.guardianAccount === guardianAccount &&
            guardian.verifier?.id === selectedVerifier?.id,
        ) !== -1
      ) {
        return { ...INIT_HAS_ERROR, errorMsg: t('This guardian already exists') };
      } else {
        return { ...INIT_NONE_ERROR };
      }
    }
    return { ...INIT_NONE_ERROR };
  }, [account, country?.code, editGuardian, isEdit, selectedType, selectedVerifier?.id, t, userGuardiansList]);

  const thirdPartyConfirm = useCallback(
    async (
      guardianAccount: string,
      thirdPartyInfo: thirdPartyInfoType,
      verifierInfo: VerifierItem,
      guardianType: LoginType,
    ) => {
      const rst = await verifyToken(guardianType, {
        accessToken: thirdPartyInfo.accessToken,
        id: thirdPartyInfo.id,
        verifierId: verifierInfo.id,
        chainId: originChainId,
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
      });
    },
    [verifyToken, originChainId],
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
        setGuardianTypeError({
          isError: true,
          errorMsg: guardianErrorMsg,
        });
        setGuardianError({ ...INIT_NONE_ERROR });
        return;
      }
    }

    const _guardianError = checkCurGuardianRepeat();
    setGuardianError(_guardianError);
    if (_guardianError.isError) return;

    if ([LoginType.Apple, LoginType.Google].includes(guardianType)) {
      if (!thirdPartyInfoRef.current) return;
      try {
        Loading.show();
        await thirdPartyConfirm(guardianAccount || '', thirdPartyInfoRef.current, selectedVerifier, guardianType);
      } catch (error) {
        CommonToast.failError(error);
      }
      Loading.hide();
      return;
    }

    ActionSheet.alert({
      title2: (
        <Text>
          <TextL>{`${selectedVerifier.name} will send a verification code to `}</TextL>
          <TextL style={fonts.mediumFont}>{showGuardianAccount || guardianAccount}</TextL>
          <TextL>{` to verify your ${guardianType === LoginType.Phone ? 'phone number' : 'email address'}.`}</TextL>
        </Text>
      ),
      buttons: [
        {
          title: t('Cancel'),
          type: 'outline',
        },
        {
          title: t('Confirm'),
          onPress: async () => {
            try {
              if ([LoginType.Email, LoginType.Phone].includes(guardianType)) {
                const reCaptchaToken = await verifyHumanMachine(language);
                Loading.show();
                const req = await verification.sendVerificationCode({
                  headers: {
                    reCaptchaToken: reCaptchaToken as string,
                  },
                  params: {
                    type: LoginType[guardianType],
                    guardianIdentifier: guardianAccount,
                    verifierId: selectedVerifier.id,
                    chainId: originChainId,
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
                  });
                } else {
                  throw new Error('send fail');
                }
              }
            } catch (error) {
              CommonToast.failError(error);
            }
            Loading.hide();
          },
        },
      ],
    });
  }, [
    selectedVerifier,
    selectedType,
    account,
    checkCurGuardianRepeat,
    t,
    country.code,
    thirdPartyConfirm,
    originChainId,
  ]);

  const onApproval = useCallback(() => {
    const _guardianError = checkCurGuardianRepeat();
    setGuardianError(_guardianError);
    if (_guardianError.isError || !editGuardian || !selectedVerifier) return;
    dispatch(setPreGuardianAction(editGuardian));

    navigationService.navigate('GuardianApproval', {
      approvalType: ApprovalType.editGuardian,
      guardianItem: {
        ...editGuardian,
        verifier: selectedVerifier,
      },
    });
  }, [checkCurGuardianRepeat, dispatch, editGuardian, selectedVerifier]);

  const onRemove = useCallback(() => {
    if (!editGuardian) return;
    if (editGuardian.isLoginAccount) {
      ActionSheet.alert({
        title2: t(`This guardian is login account and cannot be remove`),
        buttons: [
          {
            title: t('OK'),
          },
        ],
      });
      return;
    }

    ActionSheet.alert({
      title: t('Are you sure you want to remove this guardian?'),
      message: t(`Removing a guardian requires guardians' approval`),
      buttons: [
        {
          title: t('Close'),
          type: 'outline',
        },
        {
          title: t('Send Request'),
          onPress: () => {
            navigationService.navigate('GuardianApproval', {
              approvalType: ApprovalType.deleteGuardian,
              guardianItem: editGuardian,
            });
          },
        },
      ],
    });
  }, [editGuardian, t]);

  const isConfirmDisable = useMemo(
    () => !selectedVerifier || !selectedType || !account,
    [account, selectedType, selectedVerifier],
  );

  const isApprovalDisable = useMemo(
    () => selectedVerifier?.id === editGuardian?.verifier?.id,
    [editGuardian, selectedVerifier],
  );

  const onChooseType = useCallback((_type: TypeItemType) => {
    setSelectedType(_type);
    setAccount(undefined);
    setFirstName(undefined);
    thirdPartyInfoRef.current = undefined;
    setGuardianError({ ...INIT_NONE_ERROR });
  }, []);

  const onAppleSign = useCallback(async () => {
    Loading.show();
    let userInfo: AppleAuthentication;
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

  const renderGoogleAccount = useCallback(() => {
    return (
      <>
        <TextM style={pageStyles.accountLabel}>Guardian Google</TextM>
        {account ? (
          <View style={pageStyles.thirdPartAccount}>
            {firstName && <TextM style={pageStyles.firstNameStyle}>{firstName}</TextM>}
            <TextS style={[!!firstName && FontStyles.font3]} numberOfLines={1}>
              {account}
            </TextS>
          </View>
        ) : (
          <Touchable onPress={onGoogleSign}>
            <View style={pageStyles.oAuthBtn}>
              <TextM style={[FontStyles.font4, fonts.mediumFont]}>Click Add Google Account</TextM>
            </View>
          </Touchable>
        )}
      </>
    );
  }, [account, firstName, onGoogleSign]);

  const renderAppleAccount = useCallback(() => {
    return (
      <>
        <TextM style={pageStyles.accountLabel}>Guardian Apple</TextM>
        {account ? (
          <View style={pageStyles.thirdPartAccount}>
            {firstName && <TextM style={pageStyles.firstNameStyle}>{firstName}</TextM>}
            <TextS style={[!!firstName && FontStyles.font3]} numberOfLines={1}>
              {account}
            </TextS>
          </View>
        ) : (
          <Touchable onPress={onAppleSign}>
            <View style={pageStyles.oAuthBtn}>
              <TextM style={[FontStyles.font4, fonts.mediumFont]}>Click Add Apple ID</TextM>
            </View>
          </Touchable>
        )}
      </>
    );
  }, [account, firstName, onAppleSign]);

  const renderGuardianAccount = useCallback(() => {
    if (isEdit) {
      return (
        <View style={pageStyles.accountWrap}>
          <TextM style={pageStyles.accountLabel}>Guardian Apple</TextM>
          <GuardianAccountItem guardian={editGuardian} />
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
            label={t('Guardian email')}
            value={account}
            placeholder={t('Enter email')}
            maxLength={30}
            onChangeText={onAccountChange}
            errorMessage={guardianTypeError.isError ? guardianTypeError.errorMsg : ''}
            keyboardType="email-address"
          />
        );
      case LoginType.Phone:
        return (
          <PhoneInput
            label={t('Guardian Phone')}
            theme="white-bg"
            value={account}
            errorMessage={guardianTypeError.isError ? guardianTypeError.errorMsg : ''}
            onChangeText={onAccountChange}
            selectCountry={country}
            onCountryChange={setCountry}
          />
        );
      case LoginType.Google:
        return renderGoogleAccount();
      case LoginType.Apple:
        return renderAppleAccount();
      default:
        break;
    }
    return <></>;
  }, [
    account,
    country,
    editGuardian,
    guardianTypeError.errorMsg,
    guardianTypeError.isError,
    isEdit,
    onAccountChange,
    renderAppleAccount,
    renderGoogleAccount,
    selectedType,
    t,
  ]);

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={isEdit ? t('Edit Guardians') : t('Add Guardians')}
      leftCallback={() => navigationService.navigate('GuardianHome')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.contentWrap}>
        {!isEdit && (
          <>
            <TextM style={pageStyles.titleLabel}>{t('Guardian Type')}</TextM>
            <ListItem
              onPress={() => {
                GuardianTypeSelectOverlay.showList({
                  list: loginTypeList,
                  labelAttrName: 'name',
                  value: selectedType?.value,
                  callBack: onChooseType,
                });
              }}
              titleStyle={[GStyles.flexRowWrap, GStyles.itemCenter]}
              titleTextStyle={[pageStyles.titleTextStyle, !selectedType && FontStyles.font7]}
              style={pageStyles.typeWrap}
              titleLeftElement={
                selectedType?.icon && <Svg icon={selectedType.icon} size={pTd(28)} iconStyle={pageStyles.typeIcon} />
              }
              title={selectedType?.name || t('Select guardian types')}
              rightElement={<Svg size={pTd(20)} icon="down-arrow" />}
            />
          </>
        )}

        {renderGuardianAccount()}

        <TextM style={pageStyles.titleLabel}>{t('Verifier')}</TextM>
        <ListItem
          onPress={() => {
            VerifierSelectOverlay.showList({
              id: selectedVerifier?.id,
              labelAttrName: 'name',
              list: verifierList,
              callBack: onChooseVerifier,
            });
          }}
          titleLeftElement={
            selectedVerifier && (
              <VerifierImage style={pageStyles.verifierImageStyle} size={pTd(30)} uri={selectedVerifier.imageUrl} />
            )
          }
          titleStyle={[GStyles.flexRowWrap, GStyles.itemCenter]}
          titleTextStyle={[pageStyles.titleTextStyle, !selectedVerifier && FontStyles.font7]}
          style={pageStyles.verifierWrap}
          title={selectedVerifier?.name || t('Select guardian verifiers')}
          rightElement={<Svg size={pTd(20)} icon="down-arrow" />}
        />
        {guardianError.isError && <TextS style={pageStyles.errorTips}>{guardianError.errorMsg || ''}</TextS>}
      </View>

      <View>
        {isEdit ? (
          <>
            <CommonButton disabled={isApprovalDisable} type="primary" onPress={onApproval}>
              {t('Send Request')}
            </CommonButton>
            <CommonButton
              style={pageStyles.removeBtnWrap}
              type="clear"
              onPress={onRemove}
              titleStyle={FontStyles.font12}>
              {t('Remove')}
            </CommonButton>
          </>
        ) : (
          <CommonButton disabled={isConfirmDisable} type="primary" onPress={onConfirm}>
            {t('Confirm')}
          </CommonButton>
        )}
      </View>
    </PageContainer>
  );
};

export default GuardianEdit;
