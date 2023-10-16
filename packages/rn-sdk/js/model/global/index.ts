import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { PortkeyConfig, setCurrChainId } from 'global';
import {
  AccountOriginalType,
  AfterVerifiedConfig,
  VerifiedGuardianDoc,
  wrapExtraData,
} from 'model/verify/after-verify';
import { GuardianConfig } from 'model/verify/guardian';
import { SignUpConfig } from 'model/verify/sign-up';
import { SocialRecoveryConfig } from 'model/verify/social-recovery';
import { NetworkController } from 'network/controller';
import { AccountOrGuardianOriginalTypeStr } from 'network/dto/guardian';
import {
  RequestRegisterOrSocialRecoveryResult,
  RequestRegisterParams,
  RequestSocialRecoveryParams,
} from 'network/dto/wallet';
import { GlobalStorage } from 'service/storage';
import { CountryCodeDataDTO } from 'types/wallet';

export const COUNTRY_CODE_DATA_KEY = 'countryCodeData';
export const CURRENT_USING_COUNTRY_CODE = 'currentUsingCountryCode';

export const attemptAccountCheck = async (accountIdentifier: string): Promise<AccountCheckResult> => {
  const registerResultDTO = await NetworkController.getRegisterResult(accountIdentifier);
  if (registerResultDTO?.result) {
    const { originChainId } = registerResultDTO.result;
    originChainId && setCurrChainId(originChainId as any);
    const guardianResultDTO = await NetworkController.getAccountIdentifierResult(originChainId, accountIdentifier);
    return {
      hasRegistered: guardianResultDTO?.guardianList?.guardians?.length > 0,
    };
  } else if (registerResultDTO?.errCode === '3002') {
    return {
      hasRegistered: false,
    };
  } else {
    throw new Error('network failure');
  }
};

export const checkForCountryCodeCached = async (): Promise<boolean> => {
  const countryCodeDataDTO = await NetworkController.getCountryCodeInfo();
  if (countryCodeDataDTO) {
    GlobalStorage.set(COUNTRY_CODE_DATA_KEY, JSON.stringify(countryCodeDataDTO));
    GlobalStorage.set(CURRENT_USING_COUNTRY_CODE, JSON.stringify(countryCodeDataDTO.locateData));
    return true;
  } else {
    return false;
  }
};

export const getCachedCountryCodeData = async (): Promise<CountryCodeDataDTO> => {
  const countryCodeDataDTO = await GlobalStorage.getString(COUNTRY_CODE_DATA_KEY);
  if (countryCodeDataDTO) {
    const result = JSON.parse(countryCodeDataDTO);
    return result;
  } else {
    return await NetworkController.getCountryCodeInfo();
  }
};

export const isReacptchaOpen = async (scene: OperationTypeEnum): Promise<boolean> => {
  const result = await NetworkController.isGoogleRecaptchaOpen(scene);
  return result ?? false;
};

export const getRegisterPageData = async (
  accountIdentifier: string,
  accountOriginalType: AccountOriginalType,
  navigateToGuardianPage: (guardianConfig: GuardianConfig, callback: (data: VerifiedGuardianDoc) => void) => void,
): Promise<SignUpConfig> => {
  const recommendedGuardian = await NetworkController.getRecommendedGuardian();
  const chainId = await PortkeyConfig.currChainId();
  return {
    accountIdentifier,
    accountOriginalType,
    navigateToGuardianPage,
    guardianConfig: {
      accountIdentifier,
      accountOriginalType,
      isLoginGuardian: true,
      name: recommendedGuardian.name ?? 'Portkey',
      imageUrl: recommendedGuardian.imageUrl ?? null,
      sendVerifyCodeParams: {
        type: AccountOriginalType[accountOriginalType] as AccountOrGuardianOriginalTypeStr,
        guardianIdentifier: accountIdentifier,
        verifierId: recommendedGuardian.id,
        chainId,
        operationType: OperationTypeEnum.register,
      },
    },
  };
};

export const getSocialRecoveryPageData = async (
  accountIdentifier: string,
  accountOriginalType: AccountOriginalType,
): Promise<SocialRecoveryConfig> => {
  const guardians = await NetworkController.getGuardianInfo(await PortkeyConfig.currChainId(), accountIdentifier);
  const chainId = await PortkeyConfig.currChainId();
  return {
    accountIdentifier,
    accountOriginalType,
    guardians: (guardians.guardianList.guardians ?? []).map(guardian => ({
      ...guardian,
      accountIdentifier,
      accountOriginalType,
      name: guardian.name ?? 'Portkey',
      imageUrl: guardian.imageUrl ?? '',
      sendVerifyCodeParams: {
        type: guardian.type as any,
        guardianIdentifier: guardian.guardianIdentifier,
        verifierId: guardian.verifierId,
        chainId,
        operationType: OperationTypeEnum.register,
      },
    })),
  };
};

export const requestSocialRecoveryOrRegister = async (
  params: AfterVerifiedConfig,
): Promise<RequestRegisterOrSocialRecoveryResult> => {
  const { fromRecovery, accountIdentifier, verifiedGuardians, manager, chainId, context, extraData } = params;
  if (fromRecovery) {
    const socialRecoveryParams: RequestSocialRecoveryParams = {
      loginGuardianIdentifier: accountIdentifier,
      manager,
      chainId,
      context,
      extraData: wrapExtraData(extraData),
      guardiansApproved: verifiedGuardians.map(guardian => ({
        type: guardian.type,
        identifier: guardian.identifier,
        verifierId: guardian.verifierId,
        verificationDoc: guardian.verificationDoc,
        signature: guardian.signature,
      })),
    };
    return await NetworkController.requestSocialRecovery(socialRecoveryParams);
  } else {
    const registerParams: RequestRegisterParams = {
      chainId,
      loginGuardianIdentifier: accountIdentifier,
      verifierId: verifiedGuardians[0].verifierId,
      verificationDoc: verifiedGuardians[0].verificationDoc,
      signature: verifiedGuardians[0].signature,
      context,
      type: verifiedGuardians[0].type,
      manager,
      extraData: wrapExtraData(extraData),
    };
    return await NetworkController.requestRegister(registerParams);
  }
};

enum GuardianType {
  Email,
  Phone,
  Google,
  Apple,
}

export const guardianTypeStrToEnum = (guardianType: AccountOrGuardianOriginalTypeStr): any => {
  switch (guardianType) {
    case 'Email':
      return GuardianType.Email;
    case 'Phone':
      return GuardianType.Phone;
    case 'Google':
      return GuardianType.Google;
    case 'Apple':
      return GuardianType.Apple;
    default:
      throw new Error('invalid guardian type');
  }
};

export interface AccountCheckResult {
  hasRegistered: boolean;
}
