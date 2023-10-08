import { PortkeyConfig } from 'global';
import { AccountIdentifierStatusDTO, RegisterStatusDTO } from 'network/dto/signIn';
import { ResultWrapper, TypedUrlParams, nativeFetch, portkeyModulesEntity } from 'service/native-modules';
import { APIPaths } from 'network/path';
import { ChainId } from '@portkey-wallet/types';
import {
  CheckVerifyCodeParams,
  CheckVerifyCodeResultDTO,
  RecaptchaPlatformType,
  SendVerifyCodeHeader,
  SendVerifyCodeParams,
  SendVerifyCodeResultDTO,
} from 'network/dto/guardian';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { CountryCodeDataDTO } from 'types/wallet';

export class NetworkControllerEntity {
  private endPoint: string = PortkeyConfig.endPointUrl;

  private realExecute = <T>(
    url: string,
    method: 'GET' | 'POST',
    params?: any,
    headers?: any,
  ): Promise<ResultWrapper<T>> => {
    if (method === 'GET' && params) {
      url += '?';
      Object.entries(params).forEach(([key, value]) => {
        url = url + `&${key}=${value ?? 'null'}`;
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
    const res = await this.realExecute<{ isOpen: boolean }>(this.parseUrl(APIPaths.CHECK_GOOGLE_RECAPTCHA), 'POST', {
      operationType,
    });
    return res?.result?.isOpen ?? false;
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
