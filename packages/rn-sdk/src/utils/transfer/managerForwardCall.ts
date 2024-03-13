/**
 *
 * @param ParamsOptionArgs
 *  when transfer
 *    symbol: string,
 *    to: caAddress,
 *    amount: string,
 *    memo: string,
 */

import { SendOptions } from 'packages/contracts/types';
import { GuardiansApprovedType } from 'packages/types/types-ca/routeParams';
import { ContractBasic } from 'packages/utils/contract';

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
