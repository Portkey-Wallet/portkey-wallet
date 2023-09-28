import { PortkeyConfig } from 'global';
import { AccountIdentifierStatusDTO, RegisterStatusDTO } from 'network/dto/signIn';
import { ResultWrapper, nativeFetch } from 'service/native-modules';
import { APIPaths } from 'network/path';
import { ChainId } from '@portkey-wallet/types';

export class NetworkControllerEntity {
  private endPoint: string = PortkeyConfig.endPointUrl;

  private realExecute = <T>(
    url: string,
    method: 'GET' | 'POST',
    params: { [x: string]: string | number | null | undefined },
  ): Promise<ResultWrapper<T>> => {
    if (method === 'GET') {
      url += '?';
      Object.entries(params).forEach(([key, value]) => {
        url = url + `&${key}=${value ?? 'null'}`;
      });
    }
    const result = nativeFetch<T>(url, method, params);
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
    return res?.result;
  };

  parseUrl = (url: string) => {
    return `${this.endPoint}${url}`;
  };
}

export const NetworkController = new NetworkControllerEntity();
