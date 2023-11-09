import { PortkeyConfig } from 'global/constants';
import { AccountIdentifierStatusDTO, RegisterStatusDTO } from 'network/dto/signIn';
import { NetworkOptions, ResultWrapper, TypedUrlParams, nativeFetch } from 'service/native-modules';
import { APIPaths } from 'network/path';
import { ChainId } from '@portkey-wallet/types';
import {
  CheckVerifyCodeParams,
  CheckVerifyCodeResultDTO,
  GetGuardianInfoResultDTO,
  GetRecommendedGuardianResultDTO,
  RecaptchaPlatformType,
  SendVerifyCodeHeader,
  SendVerifyCodeParams,
  SendVerifyCodeResultDTO,
  VerifyAppleGuardianParams,
  VerifyGoogleGuardianParams,
} from 'network/dto/guardian';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { CountryCodeDataDTO } from 'types/wallet';
import {
  AElfChainStatusDTO,
  CheckRegisterOrRecoveryProcessParams,
  RecoveryProgressDTO,
  RegisterProgressDTO,
  RequestRegisterOrSocialRecoveryResultDTO,
  RequestRegisterParams,
  RequestSocialRecoveryParams,
} from 'network/dto/wallet';
import { sleep } from '@portkey-wallet/utils';

const DEFAULT_MAX_POLLING_TIMES = 50;

export class NetworkControllerEntity {
  private realExecute = async <T>(
    url: string,
    method: 'GET' | 'POST',
    params?: any,
    headers?: any,
    extraOptions?: NetworkOptions,
  ): Promise<ResultWrapper<T>> => {
    if (method === 'GET' && params) {
      url += '?';
      Object.entries(params).forEach(([key, value]) => {
        url = url + `&${key}=${encodeURIComponent((value ?? 'null') as string)}`;
      });
    }
    const result = nativeFetch<T>(url, method, params, headers, extraOptions);
    return result;
  };

  getRegisterResult = async (accountIdentifier: string): Promise<ResultWrapper<RegisterStatusDTO>> => {
    return await this.realExecute<RegisterStatusDTO>(await this.parseUrl(APIPaths.GET_REGISTER_INFO), 'GET', {
      loginGuardianIdentifier: accountIdentifier,
    });
  };

  getAccountIdentifierResult = async (
    chainId: ChainId | string,
    accountIdentifier: string,
  ): Promise<AccountIdentifierStatusDTO> => {
    const res = await this.realExecute<AccountIdentifierStatusDTO>(
      await this.parseUrl(APIPaths.GET_GUARDIAN_INFO),
      'GET',
      {
        chainId,
        guardianIdentifier: accountIdentifier,
        loginGuardianIdentifier: accountIdentifier,
      },
    );
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  isGoogleRecaptchaOpen = async (operationType: OperationTypeEnum): Promise<boolean> => {
    const res = await this.realExecute<boolean>(await this.parseUrl(APIPaths.CHECK_GOOGLE_RECAPTCHA), 'POST', {
      operationType,
    });
    return res?.result ?? false;
  };

  getRecommendedGuardian = async (chainId?: string): Promise<GetRecommendedGuardianResultDTO> => {
    const res = await this.realExecute<GetRecommendedGuardianResultDTO>(
      await this.parseUrl(APIPaths.GET_RECOMMEND_GUARDIAN),
      'POST',
      { chainId: chainId ?? (await PortkeyConfig.currChainId()) },
    );
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  getGuardianInfo = async (
    chainId: string,
    loginGuardianIdentifier?: string,
    caHash?: string,
  ): Promise<GetGuardianInfoResultDTO> => {
    let params = {
      chainId,
    };
    caHash && (params = Object.assign(params, { caHash }));
    loginGuardianIdentifier &&
      (params = Object.assign(params, { loginGuardianIdentifier, guardianIdentifier: loginGuardianIdentifier }));
    const res = await this.realExecute<GetGuardianInfoResultDTO>(
      await this.parseUrl(APIPaths.GET_GUARDIAN_INFO),
      'GET',
      params,
    );
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  getNetworkInfo = async (): Promise<AElfChainStatusDTO> => {
    const res = await this.realExecute<AElfChainStatusDTO>(await this.parseUrl(APIPaths.CHECK_CHAIN_STATUS), 'GET');
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  checkQrCodeStatus = async (id: string): Promise<boolean> => {
    const res = await this.realExecute<boolean>(await this.parseUrl(APIPaths.CHECK_QR_CODE_STATUS), 'POST', {
      id,
    });
    return res?.result ?? false;
  };

  sendVerifyCode = async (
    params: SendVerifyCodeParams,
    headers?: SendVerifyCodeHeader | TypedUrlParams,
  ): Promise<SendVerifyCodeResultDTO> => {
    const res = await this.realExecute<SendVerifyCodeResultDTO>(
      await this.parseUrl(APIPaths.SEND_VERIFICATION_CODE),
      'POST',
      Object.assign(params, { platformType: getPlatformType() }),
      headers,
    );
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  checkVerifyCode = async (params: CheckVerifyCodeParams): Promise<CheckVerifyCodeResultDTO> => {
    const res = await this.realExecute<CheckVerifyCodeResultDTO>(
      await this.parseUrl(APIPaths.CHECK_VERIFICATION_CODE),
      'POST',
      params,
    );
    if (!res) throw new Error('network failure');
    const { result, errMessage } = res;
    return Object.assign(
      {},
      result ?? {
        verificationDoc: '',
        signature: '',
      },
      {
        failedBecauseOfTooManyRequests: errMessage?.includes('Too Many Retries'),
      } as Partial<CheckVerifyCodeResultDTO>,
    );
  };

  verifyGoogleGuardianInfo = async (params: VerifyGoogleGuardianParams): Promise<CheckVerifyCodeResultDTO> => {
    const res = await this.realExecute<CheckVerifyCodeResultDTO>(
      await this.parseUrl(APIPaths.VERIFY_GOOGLE_TOKEN),
      'POST',
      params,
    );
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  verifyAppleGuardianInfo = async (params: VerifyAppleGuardianParams): Promise<CheckVerifyCodeResultDTO> => {
    const res = await this.realExecute<CheckVerifyCodeResultDTO>(
      await this.parseUrl(APIPaths.VERIFY_APPLE_TOKEN),
      'POST',
      params,
    );
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  requestRegister = async (params: RequestRegisterParams): Promise<RequestRegisterOrSocialRecoveryResultDTO> => {
    const res = await this.realExecute<RequestRegisterOrSocialRecoveryResultDTO>(
      await this.parseUrl(APIPaths.REQUEST_REGISTER),
      'POST',
      params,
    );
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  requestSocialRecovery = async (
    params: RequestSocialRecoveryParams,
  ): Promise<RequestRegisterOrSocialRecoveryResultDTO> => {
    const res = await this.realExecute<RequestRegisterOrSocialRecoveryResultDTO>(
      await this.parseUrl(APIPaths.REQUEST_RECOVERY),
      'POST',
      params,
    );
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  checkRegisterProcess = async (
    sessionId: string,
    options?: NetworkOptions,
  ): Promise<RegisterProgressDTO | null | undefined> => {
    const res = await this.realExecute<RegisterProgressDTO>(
      await this.parseUrl(APIPaths.CHECK_REGISTER_STATUS),
      'GET',
      { filter: `_id:${sessionId}` } as CheckRegisterOrRecoveryProcessParams,
      {},
      options,
    );
    return res.result;
  };

  checkSocialRecoveryProcess = async (
    sessionId: string,
    options?: NetworkOptions,
  ): Promise<RecoveryProgressDTO | null | undefined> => {
    const res = await this.realExecute<RecoveryProgressDTO>(
      await this.parseUrl(APIPaths.CHECK_SOCIAL_RECOVERY_STATUS),
      'GET',
      { filter: `_id:${sessionId}` } as CheckRegisterOrRecoveryProcessParams,
      {},
      options,
    );
    return res.result;
  };

  getCountryCodeInfo = async (): Promise<CountryCodeDataDTO> => {
    const res = await this.realExecute<CountryCodeDataDTO>(await this.parseUrl(APIPaths.GET_PHONE_COUNTRY_CODE), 'GET');
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  parseUrl = async (url: string) => {
    return `${await PortkeyConfig.endPointUrl()}${url}`;
  };
}

const getPlatformType = (): RecaptchaPlatformType => {
  return RecaptchaPlatformType.JS;
  //   const platformName = portkeyModulesEntity.NativeWrapperModule.platformName;
  //   switch (platformName) {
  //     case 'android':
  //       return RecaptchaPlatformType.ANDROID;
  //     case 'ios':
  //       return RecaptchaPlatformType.IOS;
  //     default:
  //       return RecaptchaPlatformType.JS;
  //   }
};

export const NetworkController = new NetworkControllerEntity();

export const handleRequestPolling = async <T>(config: RequestPollingConfig<T>): Promise<T> => {
  const {
    sendRequest,
    maxPollingTimes = DEFAULT_MAX_POLLING_TIMES,
    timeGap = 1000,
    verifyResult = () => true,
    declareFatalFail = () => false,
  } = config;
  let pollingTimes = 0;
  let result: T | null | undefined = null;
  while (pollingTimes < maxPollingTimes) {
    try {
      result = await sendRequest();
    } catch (ignored) {
      console.error(ignored);
    }
    if (result && verifyResult(result)) {
      break;
    } else if (result && declareFatalFail(result)) {
      throw new Error('fatal error in handleRequestPolling()');
    }
    pollingTimes++;
    await sleep(timeGap);
  }
  if (!result) throw new Error('network failure');
  return result;
};

export type RequestPollingConfig<T> = {
  sendRequest: () => Promise<T | null | undefined>;
  maxPollingTimes?: number;
  timeGap?: number;
  verifyResult?: (result: T) => boolean;
  declareFatalFail?: (result: T) => boolean;
};
