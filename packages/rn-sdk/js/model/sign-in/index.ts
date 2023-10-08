import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { PortkeyConfig, setCurrChainId } from 'global';
import { AccountOriginalType } from 'model/verify/after-verify';
import { SignUpConfig } from 'model/verify/sign-up';
import { NetworkController } from 'network/controller';
import { AccountOrGuardianOriginalTypeStr } from 'network/dto/guardian';
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

export const getCachedCountryCodeData = (): CountryCodeDataDTO | undefined => {
  const countryCodeDataDTO = GlobalStorage.getString(COUNTRY_CODE_DATA_KEY);
  if (countryCodeDataDTO) {
    const result = JSON.parse(countryCodeDataDTO);
    return result;
  }
};

export const isReacptchaOpen = async (scene: OperationTypeEnum): Promise<boolean> => {
  const result = await NetworkController.isGoogleRecaptchaOpen(scene);
  return result ?? false;
};

export const getRegisterPageData = async (
  accountIdentifier: string,
  accountOriginalType: AccountOriginalType,
): Promise<SignUpConfig> => {
  const recommendedGuardian = await NetworkController.getRecommendedGuardian();
  return {
    accountIdentifier,
    accountOriginalType,
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
        chainId: PortkeyConfig.currChainId,
        operationType: OperationTypeEnum.register,
      },
    },
  };
};

export interface AccountCheckResult {
  hasRegistered: boolean;
}
