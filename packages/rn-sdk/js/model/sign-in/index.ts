import { NetworkController } from 'network/controller';
import { GlobalStorage } from 'service/storage';
import { CountryCodeDataDTO } from 'types/wallet';

export const COUNTRY_CODE_DATA_KEY = 'countryCodeDataDTO';

export const attemptAccountCheck = async (accountIdentifier: string): Promise<AccountCheckResult> => {
  const registerResultDTO = await NetworkController.getRegisterResult(accountIdentifier);
  if (registerResultDTO?.result) {
    const { originChainId } = registerResultDTO.result;
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

export const checkForCountryCodeCached = async (): Promise<void> => {
  const countryCodeDataDTO = await NetworkController.getCountryCodeInfo();
  if (countryCodeDataDTO) {
    GlobalStorage.set(COUNTRY_CODE_DATA_KEY, JSON.stringify(countryCodeDataDTO));
  }
};

export const getCachedCountryCodeData = (): CountryCodeDataDTO | undefined => {
  const countryCodeDataDTO = GlobalStorage.getString(COUNTRY_CODE_DATA_KEY);
  if (countryCodeDataDTO) {
    return JSON.parse(countryCodeDataDTO);
  }
};

export interface AccountCheckResult {
  hasRegistered: boolean;
}
