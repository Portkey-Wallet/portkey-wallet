/**
 *
 * @param ParamsOptionArgs
 *  when transfer
 *    symbol: string,
 *    to: caAddress,
 *    amount: string,
 *    memo: string,
 */

import { SendOptions } from '@portkey-wallet/contracts/types';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { GuardiansApprovedType } from '@portkey-wallet/types/types-ca/guardian';

type ParamsOptionArgs = any;

interface ParamsOption {
  caHash: string;
  contractAddress: string; // Contract address that needs to be traded
  methodName: string; // 'Transfer',
  args: ParamsOptionArgs;
  guardiansApproved?: GuardiansApprovedType[];
}

export interface ManagerForwardCallParams {
  paramsOption: ParamsOption;
  contract: ContractBasic;
  sendOptions?: SendOptions;
}

export const managerForwardCall = ({ contract, paramsOption, sendOptions }: ManagerForwardCallParams) => {
  return contract.callSendMethod('ManagerForwardCall', '', paramsOption, sendOptions);
};
