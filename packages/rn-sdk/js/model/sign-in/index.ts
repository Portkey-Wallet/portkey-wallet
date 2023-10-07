import { setCurrChainId } from 'global';
import { NetworkController } from 'network/controller';
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

export interface AccountCheckResult {
  hasRegistered: boolean;
}
