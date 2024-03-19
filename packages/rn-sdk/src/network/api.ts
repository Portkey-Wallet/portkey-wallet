import { BaseConfig, RequestConfig } from '@portkey-wallet/api/types';
import { NetworkController } from 'network/controller';
import { IRampRequest } from '@portkey-wallet/ramp';

class RnsdkService implements IRampRequest {
  send = async (base: BaseConfig, config?: RequestConfig | undefined): Promise<any> => {
    const url = await NetworkController.parseUrl(config?.url ?? '');
    const method = (config?.method || 'GET') as 'GET' | 'POST';
    const res = await NetworkController.realExecute(url, method, config?.params, config?.headers);
    if (res?.result) {
      return res.result;
    }
    return res;
  };
}

export default new RnsdkService();
