import GStyles from 'assets/theme/GStyles';
import { TextL, TextM, TextS } from '@portkey-wallet/rn-components/components/CommonText';
import CommonSvg from '@portkey-wallet/rn-components/components/Svg';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import { pageStyles } from './style';
import ListItem from '@portkey-wallet/rn-components/components/ListItem';
import { useLanguage } from 'i18n/hooks';
import CommonInput from '@portkey-wallet/rn-components/components/CommonInput';
import { checkEmail } from '@portkey-wallet/utils/check';
import { LOGIN_TYPE_LIST } from 'constants/misc';
import { PRIVATE_GUARDIAN_ACCOUNT } from '@portkey-wallet/constants/constants-ca/guardian';
import { OperationTypeEnum, VerificationType, VerifierItem } from '@portkey-wallet/types/verifier';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import GuardianTypeSelectOverlay from '../components/GuardianTypeSelectOverlay';
import VerifierSelectOverlay from '../components/VerifierSelectOverlay';
import ActionSheet from '@portkey-wallet/rn-components/components/ActionSheet';
import { ErrorType } from 'types/common';
import { FontStyles } from 'assets/theme/styles';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { VerifierImage } from 'pages/Guardian/components/VerifierImage';
import fonts from 'assets/theme/fonts';
import PhoneInput from 'components/PhoneInput';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import { request } from '@portkey-wallet/api/api-did';
import verificationApiConfig from '@portkey-wallet/api/api-did/verification';
import {
  AppleAuthentication,
  useAppleAuthentication,
  useGoogleAuthentication,
  useVerifyToken,
} from 'model/hooks/authentication';
import { PortkeyConfig } from 'global/constants';
import useEffectOnce from 'hooks/useEffectOnce';
import { Verifier, getVerifierData } from 'model/contract/handler';
import { NetworkController } from 'network/controller';
import { getUnlockedWallet } from 'model/wallet';
import {
  getCachedCountryCodeData,
  guardianEnumToTypeStr,
  guardianTypeStrToEnum,
  parseGuardianInfo,
} from 'model/global';
import { GuardianConfig } from 'model/verify/guardian';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { CountryCodeItem, defaultCountryCode } from 'types/wallet';
import CommonButton from '@portkey-wallet/rn-components/components/CommonButton';
import { verifyHumanMachine } from '@portkey-wallet/rn-components/components/VerifyHumanMachine';
import { handleGuardiansApproval, handlePhoneOrEmailGuardianVerify } from 'model/verify/entry/hooks';
import { AccountOriginalType } from 'model/verify/core';
import { GuardianVerifyType, VerifiedGuardianInfo } from 'model/verify/social-recovery';
import { Buffer } from 'buffer';
import { sleep } from '@portkey-wallet/utils';
import { TargetScene } from './type';
import { ChainId } from '@portkey-wallet/types';

if (!global.Buffer) {
  global.Buffer = Buffer;
}

type thirdPartyInfoType = {
  id: string;
  accessToken: string;
};

type TypeItemType = (typeof LOGIN_TYPE_LIST)[number];

const AddGuardian = (props: { targetScene?: string; accelerateChainId: ChainId }) => {
  const { targetScene = TargetScene.NORMAL, accelerateChainId } = props;
  const { t } = useLanguage();
  const [userGuardiansList, setUserGuardiansList] = useState<Array<GuardianConfig>>([]);
  const [verifierMap, setVerifierMap] = useState<{
    [key: string]: any;
  }>([] as any);
  const verifierList: Array<Verifier> = useMemo(() => (verifierMap ? Object.values(verifierMap) : []), [verifierMap]);

  const [selectedType, setSelectedType] = useState<TypeItemType>();
  const [selectedVerifier, setSelectedVerifier] = useState<VerifierItem>();
  const [account, setAccount] = useState<string>();
  const [guardianTypeError, setGuardianTypeError] = useState<ErrorType>({ ...INIT_HAS_ERROR });
  const [guardianError, setGuardianError] = useState<ErrorType>({ ...INIT_NONE_ERROR });
  const [country, setCountry] = useState<CountryCodeItem>(defaultCountryCode);
  const [firstName, setFirstName] = useState<string>();
  const { navigateForResult, onFinish } = useBaseContainer({
    entryName: PortkeyEntries.ADD_GUARDIAN_ENTRY,
  });

  const checkMMKVStorage = async () => {
    const countryDTO = await getCachedCountryCodeData();
    setCountry(countryDTO?.locateData);
  };

  const { appleSign } = useAppleAuthentication();
  const { googleSign } = useGoogleAuthentication();
  const verifyToken = useVerifyToken();

  const thirdPartyInfoRef = useRef<thirdPartyInfoType>();

  useEffectOnce(async () => {
    await checkMMKVStorage();
    const { data } = await getVerifierData();
    const { verifierServers: verifiers } = data || {};
    console.log('verifiers', JSON.stringify(verifiers));
    verifiers && setVerifierMap(verifiers);
    const {
      caInfo: { caHash },
    } = await getUnlockedWallet();
    const chainId = await PortkeyConfig.currChainId();
    const guardiansInfo = await NetworkController.getGuardianInfo('', caHash);
    const cachedVerifierData = Object.values((await getVerifierData()).data?.verifierServers ?? {});
    const parsedGuardians = guardiansInfo?.guardianList?.guardians?.map(guardian => {
      return parseGuardianInfo(
        guardian,
        chainId,
        cachedVerifierData,
        undefined,
        undefined,
        AccountOriginalType.Email,
        OperationTypeEnum.addGuardian,
      );
    });
    console.log('guardians:', JSON.stringify(parsedGuardians));
    parsedGuardians && setUserGuardiansList(parsedGuardians);
  });

  const onAccountChange = useCallback((value: string) => {
    setAccount(value);
    setGuardianTypeError({ ...INIT_NONE_ERROR });
  }, []);

  const onChooseVerifier = useCallback((item: VerifierItem) => {
    setGuardianError({ ...INIT_NONE_ERROR });
    setSelectedVerifier(item);
  }, []);

  const isConfirmDisable = useMemo(
    () => !selectedVerifier || !selectedType || !account,
    [account, selectedType, selectedVerifier],
  );

  const checkCurGuardianRepeat = useCallback(() => {
    if (!selectedType) {
      return { ...INIT_HAS_ERROR };
    }
    if ([LoginType.Email, LoginType.Phone].includes(selectedType.value)) {
      let _account = account;

      if (selectedType.value === LoginType.Phone) {
        _account = `+${country?.code}${account}`;
      }

      if (
        userGuardiansList?.findIndex(
          guardian =>
            guardianTypeStrToEnum(guardian.sendVerifyCodeParams.type) === selectedType?.value &&
            guardian.sendVerifyCodeParams.guardianIdentifier === _account &&
            guardian.sendVerifyCodeParams.verifierId === selectedVerifier?.id,
        ) !== -1
      ) {
        return { ...INIT_HAS_ERROR, errorMsg: t('This guardian already exists') };
      } else {
        return { ...INIT_NONE_ERROR };
      }
    }

    if ([LoginType.Apple, LoginType.Google].includes(selectedType.value)) {
      const guardianAccount = thirdPartyInfoRef.current?.id;
      if (
        userGuardiansList?.findIndex(
          guardian =>
            guardianTypeStrToEnum(guardian.sendVerifyCodeParams.type) === selectedType?.value &&
            guardian.sendVerifyCodeParams.guardianIdentifier === guardianAccount &&
            guardian.sendVerifyCodeParams.verifierId === selectedVerifier?.id,
        ) !== -1
      ) {
        return { ...INIT_HAS_ERROR, errorMsg: t('This guardian already exists') };
      } else {
        return { ...INIT_NONE_ERROR };
      }
    }
    return { ...INIT_NONE_ERROR };
  }, [account, country?.code, selectedType, selectedVerifier?.id, t, userGuardiansList]);

  const thirdPartyConfirm = useCallback(
    async (
      guardianAccount: string,
      thirdPartyInfo: thirdPartyInfoType,
      verifierInfo: VerifierItem,
      guardianType: LoginType,
    ) => {
      if (!selectedVerifier) return;
      const originalChainId = await PortkeyConfig.currChainId();
      const rst = await verifyToken(guardianType, {
        accessToken: thirdPartyInfo.accessToken,
        id: thirdPartyInfo.id,
        verifierId: verifierInfo.id,
        chainId: originalChainId,
        operationType: OperationTypeEnum.addGuardian,
      });
      Loading.hide();
      if (!rst) throw new Error('verify fail');
      const thisGuardian: GuardianConfig = {
        sendVerifyCodeParams: {
          type: guardianEnumToTypeStr(guardianType),
          guardianIdentifier: guardianAccount || '',
          verifierId: selectedVerifier.id,
          chainId: originalChainId,
          operationType: OperationTypeEnum.communityRecovery,
        },
        alreadySent: true,
        accountIdentifier: 'unknown',
        accountOriginalType: AccountOriginalType.Email,
        isLoginGuardian: false,
        name: selectedVerifier.name,
        imageUrl: selectedVerifier.imageUrl,
        verifiedDoc: {
          verificationDoc: rst.verificationDoc,
          signature: rst.signature,
        },
      };
      handleGuardiansApproval({
        accelerateChainId,
        guardianVerifyType:
          targetScene === TargetScene.NORMAL
            ? GuardianVerifyType.ADD_GUARDIAN
            : GuardianVerifyType.ADD_GUARDIAN_ACCELERATE,
        accountIdentifier: '',
        accountOriginalType: AccountOriginalType.Email,
        guardians: userGuardiansList,
        particularGuardian: thisGuardian,
      });
    },
    [accelerateChainId, selectedVerifier, targetScene, userGuardiansList, verifyToken],
  );

  const onConfirm = useCallback(async () => {
    if (selectedVerifier === undefined || selectedType === undefined) return;
    const guardianType = selectedType.value;
    let guardianAccount = account;
    let showGuardianAccount;
    if (guardianType === LoginType.Phone) {
      guardianAccount = `+${country?.code}${account}`;
      showGuardianAccount = `+${country?.code} ${account}`;
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
                Loading.show();
                const accountIdentifier = guardianAccount || '';
                const accountOriginalType =
                  guardianType === LoginType.Email ? AccountOriginalType.Email : AccountOriginalType.Phone;
                const originalChainId = await PortkeyConfig.currChainId();
                const needRecaptcha = await NetworkController.isGoogleRecaptchaOpen(OperationTypeEnum.addGuardian);
                let reCaptchaToken: string | undefined;
                if (needRecaptcha) {
                  reCaptchaToken = (await verifyHumanMachine('en')) as string;
                }
                const req = await NetworkController.sendVerifyCode(
                  {
                    type: guardianEnumToTypeStr(guardianType),
                    guardianIdentifier: guardianAccount || '',
                    verifierId: selectedVerifier.id,
                    chainId: originalChainId,
                    operationType: OperationTypeEnum.addGuardian,
                  },
                  reCaptchaToken ? { reCaptchaToken } : {},
                );
                if (req.verifierSessionId) {
                  const thisGuardian: GuardianConfig = {
                    sendVerifyCodeParams: {
                      type: guardianEnumToTypeStr(guardianType),
                      guardianIdentifier: guardianAccount || '',
                      verifierId: selectedVerifier.id,
                      chainId: originalChainId,
                      operationType: OperationTypeEnum.addGuardian,
                    },
                    alreadySent: true,
                    accountIdentifier,
                    verifySessionId: req.verifierSessionId,
                    accountOriginalType,
                    isLoginGuardian: false,
                    name: selectedVerifier.name,
                    imageUrl: selectedVerifier.imageUrl,
                  };
                  const guardianVerifyResult = await handlePhoneOrEmailGuardianVerify({
                    verificationType: VerificationType.addGuardian,
                    accountIdentifier,
                    accountOriginalType,
                    deliveredGuardianInfo: JSON.stringify(thisGuardian),
                    operationType: OperationTypeEnum.addGuardian,
                  });
                  if (!guardianVerifyResult?.verifiedData) {
                    throw new Error('guardian is not verified!');
                  }
                  const verifiedData = JSON.parse(guardianVerifyResult.verifiedData) as VerifiedGuardianInfo;
                  Loading.show();
                  await sleep(500);
                  Loading.hide();
                  await sleep(200);
                  handleGuardiansApproval({
                    accelerateChainId,
                    guardianVerifyType:
                      targetScene === TargetScene.NORMAL
                        ? GuardianVerifyType.ADD_GUARDIAN
                        : GuardianVerifyType.ADD_GUARDIAN_ACCELERATE,
                    accountIdentifier,
                    accountOriginalType,
                    guardians: userGuardiansList.map(it => {
                      it.accountIdentifier = accountIdentifier;
                      it.sendVerifyCodeParams.operationType = OperationTypeEnum.addGuardian;
                      return it;
                    }),
                    particularGuardian: Object.assign({}, thisGuardian, {
                      verifiedDoc: verifiedData,
                    } as Partial<GuardianConfig>),
                  });
                } else {
                  throw new Error('send fail');
                }
              }
            } catch (error) {
              CommonToast.failError(error);
              console.error(error);
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
    country?.code,
    thirdPartyConfirm,
    accelerateChainId,
    targetScene,
    userGuardiansList,
  ]);

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
        <TextM style={pageStyles.accountLabel}>Guardian Info</TextM>
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
    if (!selectedType) return <></>;

    switch (selectedType.value) {
      case LoginType.Email:
        return (
          <CommonInput
            disabled={false}
            type="general"
            theme="white-bg"
            label={t('Guardian email')}
            value={account}
            placeholder={t('Enter email')}
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
            onCountryChange={setCountry}
            navigateForResult={navigateForResult}
            errorMessage={guardianTypeError.isError ? guardianTypeError.errorMsg : ''}
            onChangeText={onAccountChange}
            selectCountry={country}
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
    guardianTypeError.errorMsg,
    guardianTypeError.isError,
    navigateForResult,
    onAccountChange,
    renderAppleAccount,
    renderGoogleAccount,
    selectedType,
    t,
  ]);

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={t('Add Guardians')}
      leftCallback={() => {
        onFinish({ status: 'cancel' });
      }}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.contentWrap}>
        <>
          <TextM style={pageStyles.titleLabel}>{t('Guardian Type')}</TextM>
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
                <CommonSvg icon={selectedType.icon} size={pTd(28)} iconStyle={pageStyles.typeIcon} />
              )
            }
            title={selectedType?.name || t('Select guardian types')}
            rightElement={<CommonSvg size={pTd(20)} icon="down-arrow" />}
          />
        </>

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
          title={selectedVerifier?.name || t('Select guardian verifiers')}
          rightElement={<CommonSvg size={pTd(20)} icon="down-arrow" />}
        />
        {guardianError.isError && <TextS style={pageStyles.errorTips}>{guardianError.errorMsg || ''}</TextS>}
      </View>
      <View style={pageStyles.confirmBtn}>
        <CommonButton disabled={isConfirmDisable} type="primary" onPress={onConfirm}>
          {t('Confirm')}
        </CommonButton>
      </View>
    </PageContainer>
  );
};

export default AddGuardian;
