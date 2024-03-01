import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';
import { BaseSendOption } from './types';
import { GuardianItem } from 'types/guardians';

/**
 *
 * @param ParamsOptionArgs
 *  when transfer
 *    symbol: string,
 *    to: caAddress,
 *    amount: string,
 *    memo: string,
 */

type ParamsOptionArgs = any;

interface ParamsOption {
  caHash: string;
  contractAddress: string; // Contract address that needs to be traded
  methodName: string; // 'Transfer',
  args: ParamsOptionArgs;
  guardiansApproved?: GuardianItem[];
}

export interface ManagerForwardCallParams extends BaseSendOption {
  paramsOption: ParamsOption;
}

export const managerForwardCall = async ({
  rpcUrl,
  chainType,
  address, // contract address
  privateKey,
  paramsOption,
  sendOptions,
}: ManagerForwardCallParams) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callSendMethod, {
    rpcUrl,
    chainType,
    address,
    privateKey,
    methodName: 'ManagerForwardCall',
    paramsOption,
    sendOptions,
  });

  console.log(resMessage, 'resMessage===ManagerForwardCall');

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.error.message;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      ...resMessage.message,
    },
  };
};
