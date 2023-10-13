import { PortkeyConfig } from 'global';
import { AccountIdentifierStatusDTO, RegisterStatusDTO } from 'network/dto/signIn';
import { ResultWrapper, TypedUrlParams, nativeFetch, portkeyModulesEntity } from 'service/native-modules';
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
} from 'network/dto/guardian';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { CountryCodeDataDTO } from 'types/wallet';
import {
  RequestRegisterOrSocialRecoveryResult,
  RequestRegisterParams,
  RequestSocialRecoveryParams,
} from 'network/dto/wallet';

export class NetworkControllerEntity {
  private endPoint: string = PortkeyConfig.endPointUrl();

  private realExecute = <T>(
    url: string,
    method: 'GET' | 'POST',
    params?: any,
    headers?: any,
  ): Promise<ResultWrapper<T>> => {
    if (method === 'GET' && params) {
      url += '?';
      Object.entries(params).forEach(([key, value]) => {
        url = url + `&${key}=${encodeURIComponent((value ?? 'null') as string)}`;
      });
    }
    const result = nativeFetch<T>(url, method, params, headers);
    return result;
  };

  updateEndPointUrl = (endPoint: string) => {
    this.endPoint = endPoint;
  };

  getRegisterResult = async (accountIdentifier: string): Promise<ResultWrapper<RegisterStatusDTO>> => {
    return await this.realExecute<RegisterStatusDTO>(this.parseUrl(APIPaths.GET_REGISTER_INFO), 'GET', {
      loginGuardianIdentifier: accountIdentifier,
    });
  };

  getAccountIdentifierResult = async (
    chainId: ChainId | string,
    accountIdentifier: string,
  ): Promise<AccountIdentifierStatusDTO> => {
    const res = await this.realExecute<AccountIdentifierStatusDTO>(this.parseUrl(APIPaths.GET_GUARDIAN_INFO), 'GET', {
      chainId,
      guardianIdentifier: accountIdentifier,
      loginGuardianIdentifier: accountIdentifier,
    });
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  isGoogleRecaptchaOpen = async (operationType: OperationTypeEnum): Promise<boolean> => {
    const res = await this.realExecute<boolean>(this.parseUrl(APIPaths.CHECK_GOOGLE_RECAPTCHA), 'POST', {
      operationType,
    });
    return res?.result ?? false;
  };

  getRecommendedGuardian = async (chainId?: string): Promise<GetRecommendedGuardianResultDTO> => {
    const res = await this.realExecute<GetRecommendedGuardianResultDTO>(
      this.parseUrl(APIPaths.GET_RECOMMEND_GUARDIAN),
      'POST',
      { chainId: chainId ?? PortkeyConfig.currChainId() },
    );
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  getGuardianInfo = async (chainId: string, loginGuardianIdentifier: string): Promise<GetGuardianInfoResultDTO> => {
    const res = await this.realExecute<GetGuardianInfoResultDTO>(this.parseUrl(APIPaths.GET_GUARDIAN_INFO), 'GET', {
      chainId,
      loginGuardianIdentifier,
      guardianIdentifier: loginGuardianIdentifier,
    });
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  sendVerifyCode = async (
    params: SendVerifyCodeParams,
    headers?: SendVerifyCodeHeader | TypedUrlParams,
  ): Promise<SendVerifyCodeResultDTO> => {
    const res = await this.realExecute<SendVerifyCodeResultDTO>(
      this.parseUrl(APIPaths.SEND_VERIFICATION_CODE),
      'POST',
      Object.assign(params, { platformType: getPlatformType() }),
      headers,
    );
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  checkVerifyCode = async (params: CheckVerifyCodeParams): Promise<CheckVerifyCodeResultDTO> => {
    const res = await this.realExecute<CheckVerifyCodeResultDTO>(
      this.parseUrl(APIPaths.CHECK_VERIFICATION_CODE),
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

  requestRegister = async (params: RequestRegisterParams): Promise<RequestRegisterOrSocialRecoveryResult> => {
    const res = await this.realExecute<RequestRegisterOrSocialRecoveryResult>(
      this.parseUrl(APIPaths.REQUEST_REGISTER),
      'POST',
      params,
    );
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  requestSocialRecovery = async (
    params: RequestSocialRecoveryParams,
  ): Promise<RequestRegisterOrSocialRecoveryResult> => {
    const res = await this.realExecute<RequestRegisterOrSocialRecoveryResult>(
      this.parseUrl(APIPaths.REQUEST_RECOVERY),
      'POST',
      params,
    );
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  getCountryCodeInfo = async (): Promise<CountryCodeDataDTO> => {
    const res = await this.realExecute<CountryCodeDataDTO>(this.parseUrl(APIPaths.GET_PHONE_COUNTRY_CODE), 'GET');
    if (!res?.result) throw new Error('network failure');
    return res.result;
  };

  parseUrl = (url: string) => {
    return `${this.endPoint}${url}`;
  };
}

const getPlatformType = (): RecaptchaPlatformType => {
  const platformName = portkeyModulesEntity.NativeWrapperModule.platformName;
  switch (platformName) {
    case 'android':
      return RecaptchaPlatformType.ANDROID;
    case 'ios':
      return RecaptchaPlatformType.IOS;
    default:
      return RecaptchaPlatformType.JS;
  }
};

export const NetworkController = new NetworkControllerEntity();
