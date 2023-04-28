import { ChainType } from '@portkey-wallet/types';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';

export const getVerifierList = async ({
  rpcUrl,
  chainType,
  address, // contract address
}: {
  rpcUrl: string;
  address: string;
  chainType: ChainType;
}) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callViewMethod, {
    rpcUrl,
    chainType,
    address,
    methodName: 'GetVerifierServers',
  });

  if (resMessage.code === SandboxErrorCode.error) throw resMessage;
  const res = resMessage.message?.verifierServers;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      verifierList: res,
    },
  };
};
