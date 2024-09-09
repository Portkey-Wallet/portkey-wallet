import { ChainType } from '@portkey-wallet/types';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { SandboxErrorCode } from '@portkey-wallet/utils/sandboxService';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService from 'service/SandboxEventService';

interface GetTransitionFeeParams {
  chainInfo: IChainItemType;
  raw: string;
  rpcUrl: string;
  chainType?: ChainType;
}

const getDecodedTxData = async ({ chainInfo, raw, rpcUrl, chainType = 'aelf' }: GetTransitionFeeParams) => {
  const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.getDecodedTxData, {
    chainInfo,
    raw,
    rpcUrl,
    chainType,
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

export default getDecodedTxData;
