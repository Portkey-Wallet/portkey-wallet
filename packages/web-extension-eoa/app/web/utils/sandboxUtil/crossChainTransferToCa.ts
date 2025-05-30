import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';
import { BaseSendOption } from './types';
import { GuardianItem } from 'types/guardians';

export const crossChainTransferToCa = async ({
  rpcUrl,
  chainType,
  address, // contract address
  privateKey,
  paramsOption,
  sendOptions,
}: BaseSendOption & {
  paramsOption: {
    issueChainId: number;
    toChainId: string;
    symbol: string;
    to: string;
    amount: number | string;
    memo?: string;
    guardiansApproved?: GuardianItem[];
  };
}) => {
  if (!paramsOption.memo) {
    delete paramsOption.memo;
  }
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callSendMethod, {
    rpcUrl: rpcUrl,
    address,
    privateKey,
    chainType,
    methodName: 'CrossChainTransfer',
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
