import { request } from '@portkey-wallet/api/api-did';
import { ChainId, ChainType } from '@portkey-wallet/types';
import { SandboxErrorCode, SandboxEventService, SandboxEventTypes } from '@portkey-wallet/utils/sandboxService';

export const getHolderInfo = async (params: { chainId: ChainId; guardianIdentifier?: string; caHash?: string }) =>
  request.wallet.guardianIdentifiers({
    params,
  });

export const getHolderInfoByContract = async ({
  rpcUrl,
  chainType,
  address, // contract address
  paramsOption,
}: {
  rpcUrl: string;
  address: string;
  chainType: ChainType;
  paramsOption: {
    guardianIdentifier?: string;
    caHash?: string;
  };
}) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callViewMethod, {
    rpcUrl,
    chainType,
    address,
    methodName: 'GetHolderInfo',
    paramsOption,
  });

  if (resMessage.code === SandboxErrorCode.error) throw resMessage.error;
  return {
    code: resMessage.code,
    result: {
      rpcUrl,
      ...resMessage.message,
    },
  };
};
