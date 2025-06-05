import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';
import { BaseSendOption } from './types';

export interface CallSendMethodParams extends BaseSendOption {
  methodName: string;
  paramsOption: any;
}

export const callSendMethod = async ({
  rpcUrl,
  chainType,
  address, // contract address
  privateKey,
  methodName,
  paramsOption,
  sendOptions,
}: CallSendMethodParams) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callSendMethod, {
    rpcUrl,
    chainType,
    address,
    privateKey,
    methodName,
    paramsOption,
    sendOptions,
  });

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.error.message;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      ...resMessage.message,
    },
  };
};
