import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';
import { BaseSendOption } from './types';

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

export interface callContractParams extends BaseSendOption {
  paramsOption: ParamsOptionArgs;
  methodName: string; // 'Transfer',
}

export const callContract = async ({
  rpcUrl,
  chainType,
  address, // contract address
  privateKey,
  paramsOption,
  sendOptions,
  methodName,
}: callContractParams) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callSendMethod, {
    rpcUrl,
    chainType,
    address,
    privateKey,
    methodName: methodName,
    paramsOption,
    sendOptions,
  });

  console.log(resMessage, 'resMessage===ManagerForwardCall');

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.error.message;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      message: resMessage.message,
    },
  };
};
