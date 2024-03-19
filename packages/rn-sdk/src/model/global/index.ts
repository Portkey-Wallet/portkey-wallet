import { OperationTypeEnum } from 'packages/types/verifier';
import { PortkeyConfig, setCurrChainId } from 'global/constants';
import { AccountOriginalType, NormalVerifyPathInfo, VerifiedGuardianDoc, wrapExtraData } from 'model/verify/core';
import { GuardianConfig } from 'model/verify/guardian';
import { SignUpConfig } from 'model/verify/sign-up';
import { GuardianVerifyConfig, GuardianVerifyType } from 'model/verify/social-recovery';
import { NetworkController } from 'network/controller';
import { AccountOrGuardianOriginalTypeStr, CheckVerifyCodeResultDTO, GuardianInfo } from 'network/dto/guardian';
import {
  AElfWeb3SDK,
  BaseAccountStatus,
  RequestProcessResult,
  RequestRegisterParams,
  RequestSocialRecoveryParams,
} from 'network/dto/wallet';
import { CountryCodeDataDTO } from 'types/wallet';
import { randomId, sleep } from 'packages/utils';
import { ThirdPartyAccountInfo } from 'model/verify/third-party-account';
import { GlobalStorage } from 'service/storage';
import { ChainId } from 'packages/types';
import { LoginType } from 'packages/types/types-ca/wallet';
import { Verifier } from 'model/contract/handler';

export const COUNTRY_CODE_DATA_KEY = 'countryCodeData';
export const CURRENT_USING_COUNTRY_CODE = 'currentUsingCountryCode';

export const attemptAccountCheck = async (accountIdentifier: string): Promise<AccountCheckResult> => {
  const registerResultDTO = await NetworkController.getRegisterResult(accountIdentifier);
  if (registerResultDTO?.result) {
    const { originChainId } = registerResultDTO.result;
    originChainId && setCurrChainId(originChainId as any);
    try {
      const guardianResultDTO = await NetworkController.getAccountIdentifierResult(
        originChainId ?? (await PortkeyConfig.currChainId()),
        accountIdentifier,
      );
      return {
        hasRegistered: guardianResultDTO?.guardianList?.guardians?.length > 0,
      };
    } catch (e) {
      throw new Error('network failure');
    }
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

export const isRecaptchaOpen = async (scene: OperationTypeEnum): Promise<boolean> => {
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
  thirdPartyAccountInfo?: ThirdPartyAccountInfo,
): Promise<GuardianVerifyConfig> => {
  const guardians = await NetworkController.getGuardianInfo(accountIdentifier);
  const chainId = await PortkeyConfig.currChainId();
  return {
    accountIdentifier,
    accountOriginalType,
    guardianVerifyType: GuardianVerifyType.CREATE_WALLET,
    guardians: (guardians?.guardianList?.guardians ?? []).map(guardian => parseGuardianInfo(guardian, chainId)),
    thirdPartyAccountInfo,
  };
};

export const parseGuardianInfo = (
  guardianOriginalInfo: GuardianInfo,
  chainId: ChainId,
  cachedVerifierData: Array<Verifier> = [],
  verifiedData?: CheckVerifyCodeResultDTO,
  accountIdentifier = '',
  accountOriginalType = AccountOriginalType.Email,
  operationType = OperationTypeEnum.communityRecovery,
): GuardianConfig => {
  const verifierData = cachedVerifierData.find(it => it.id === guardianOriginalInfo.verifierId);
  const { name = 'Portkey', imageUrl = '' } = verifierData || {};
  return {
    ...guardianOriginalInfo,
    accountIdentifier,
    accountOriginalType,
    name,
    imageUrl,
    thirdPartyEmail: guardianOriginalInfo.thirdPartyEmail ?? '',
    sendVerifyCodeParams: {
      type: guardianOriginalInfo.type as any,
      guardianIdentifier: guardianOriginalInfo.guardianIdentifier,
      verifierId: guardianOriginalInfo.verifierId,
      chainId,
      operationType: operationType,
    },
    identifierHash: guardianOriginalInfo.identifierHash,
    verifiedDoc: verifiedData,
  };
};

export const requestSocialRecoveryOrRegister = async (params: NormalVerifyPathInfo): Promise<RequestProcessResult> => {
  await sleep(500);
  const { address, privateKey, keyPair } = AElfWeb3SDK.createNewWallet();
  const publicKey = keyPair.getPublic('hex');
  const { fromRecovery, accountIdentifier, verifiedGuardians, chainId, extraData } = params;
  let sessionId = '';
  if (fromRecovery) {
    const socialRecoveryParams: RequestSocialRecoveryParams = {
      loginGuardianIdentifier: accountIdentifier,
      manager: address,
      chainId,
      context: {
        clientId: address,
        requestId: randomId(),
      },
      extraData: wrapExtraData(extraData),
      guardiansApproved: verifiedGuardians.map(guardian => ({
        type: guardian.type,
        identifier: guardian.identifier,
        verifierId: guardian.verifierId,
        verificationDoc: guardian.verificationDoc,
        signature: guardian.signature,
      })),
    };
    sessionId = (await NetworkController.requestSocialRecovery(socialRecoveryParams))?.sessionId ?? '';
    console.log('requestSocialRecovery sessionId', sessionId);
  } else {
    const registerParams: RequestRegisterParams = {
      chainId,
      loginGuardianIdentifier: accountIdentifier,
      verifierId: verifiedGuardians[0].verifierId,
      verificationDoc: verifiedGuardians[0].verificationDoc,
      signature: verifiedGuardians[0].signature,
      context: {
        clientId: address,
        requestId: randomId(),
      },
      type: verifiedGuardians[0].type,
      manager: address,
      extraData: wrapExtraData(extraData),
    };
    sessionId = (await NetworkController.requestRegister(registerParams))?.sessionId ?? '';
  }
  if (!sessionId) throw new Error('network failure');
  return {
    sessionId,
    privateKey,
    publicKey,
    address,
  };
};

export const getCaInfoByAccountIdentifierOrSessionId = async (
  originalChainId: string,
  accountIdentifier?: string,
  fromRecovery = false,
  sessionId?: string,
): Promise<{ caHash: string; caAddress: string }> => {
  if (accountIdentifier) {
    const result = await NetworkController.getGuardianInfo(accountIdentifier);
    return result;
  } else if (sessionId) {
    const result = fromRecovery
      ? await NetworkController.checkRegisterProcess(sessionId)
      : await NetworkController.checkSocialRecoveryProcess(sessionId);
    const item = (result?.items as Array<BaseAccountStatus>)?.find(
      (it: BaseAccountStatus) => it.chainId === originalChainId,
    );
    if (!item) throw new Error('network failure');
    return item;
  } else {
    throw new Error('params error');
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

export const guardianEnumToTypeStr = (
  guardianType: LoginType | GuardianType | AccountOriginalType,
): AccountOrGuardianOriginalTypeStr => {
  switch (guardianType) {
    case GuardianType.Email:
      return 'Email';
    case GuardianType.Phone:
      return 'Phone';
    case GuardianType.Google:
      return 'Google';
    case GuardianType.Apple:
      return 'Apple';
    default:
      throw new Error('invalid guardian type');
  }
};

export interface AccountCheckResult {
  hasRegistered: boolean;
}
