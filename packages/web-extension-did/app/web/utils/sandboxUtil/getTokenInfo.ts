import { SandboxErrorCode, SandboxEventService, SandboxEventTypes } from '@portkey-wallet/utils/sandboxService';
import { ChainType } from '@portkey/provider-types';

export const getTokenInfo = async ({
  rpcUrl,
  chainType,
  address, // contract address
  paramsOption,
}: {
  rpcUrl: string;
  address: string;
  chainType: ChainType;
  paramsOption: {
    symbol: string;
  };
}) => {
  const tokenInfoResult = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callViewMethod, {
    rpcUrl,
    chainType,
    address: address,
    methodName: 'GetTokenInfo',
    paramsOption,
  });

  if (tokenInfoResult.code === SandboxErrorCode.error) throw tokenInfoResult.error;
  const issueChainId = tokenInfoResult.message.issueChainId;
  if (typeof issueChainId !== 'number') throw Error('GetTokenInfo Error');
  return issueChainId;
};
