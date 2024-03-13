import { BaseConfig, RequestConfig } from 'packages/api/types';
import { NetworkController } from 'network/controller';
import { IRampRequest } from 'packages/ramp';

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
