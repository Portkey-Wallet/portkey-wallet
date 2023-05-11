import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';
import { BaseSendOption } from './types';

export const managerTransfer = async ({
  rpcUrl,
  chainType,
  address, // contract address
  privateKey,
  paramsOption,
  sendOptions,
}: BaseSendOption & {
  paramsOption: { caHash: string; symbol: string; to: string; amount: number; memo?: string };
}) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callSendMethod, {
    rpcUrl: rpcUrl,
    address,
    privateKey,
    chainType,
    methodName: 'ManagerTransfer',
    paramsOption,
    sendOptions,
  });

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.error;
  const message = resMessage.message;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      message,
    },
  };
};
