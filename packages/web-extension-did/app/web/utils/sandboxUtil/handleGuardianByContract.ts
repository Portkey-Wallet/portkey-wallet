import { SendOptions } from '@portkey-wallet/contracts/types';
import { ChainType } from '@portkey-wallet/types';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';

export const handleGuardianByContract = async ({
  rpcUrl,
  chainType,
  address, // contract address
  privateKey,
  paramsOption,
  sendOptions,
}: {
  rpcUrl: string;
  address: string;
  chainType: ChainType;
  privateKey: string;
  paramsOption: { method: string; params: any };
  sendOptions?: SendOptions;
}) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callSendMethod, {
    rpcUrl: rpcUrl,
    address,
    privateKey,
    chainType,
    methodName: paramsOption.method,
    paramsOption: paramsOption.params,
    sendOptions,
  });
  console.log('resMessage', resMessage);
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
