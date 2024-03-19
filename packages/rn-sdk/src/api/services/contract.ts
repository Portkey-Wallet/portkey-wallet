import { injectable } from 'inversify';
import { BaseService } from '.';
import { BaseMethodResult, CallCaMethodProps, IContractService } from 'api/types/contract';
import { AccountError } from 'api/error';
import { getCAContractInstance } from 'model/contract/handler';
import { getUnlockedWallet } from 'model/wallet';
import { SendResult, ViewResult } from '@portkey-wallet/contracts/types';
import { CheckWalletUnlocked } from 'api/decorate';

@injectable()
export class ContractService extends BaseService implements IContractService {
  @CheckWalletUnlocked()
  async callCaContractMethod(props: CallCaMethodProps) {
    const { contractMethodName: methodName, params, isViewMethod } = props;
    const contract = await getCAContractInstance();
    const { address } = await getUnlockedWallet();
    const isParamsEmpty = Object.values(params ?? {}).length === 0;
    try {
      const result: ViewResult | SendResult = isViewMethod
        ? await contract.callViewMethod(methodName, isParamsEmpty ? '' : params)
        : await contract.callSendMethod(methodName, address, isParamsEmpty ? '' : params);
      if (!result) throw new AccountError(1002);
      const { data, error } = result;
      let jsData: BaseMethodResult = {
        status: !error ? 'success' : 'fail',
        data,
        error,
      };
      if ((result as any).transactionId) {
        jsData = {
          ...jsData,
          transactionId: (result as any).transactionId,
        };
      }
      return jsData;
    } catch (e: any) {
      throw new AccountError(9999, e?.message || e);
    }
  }
}
