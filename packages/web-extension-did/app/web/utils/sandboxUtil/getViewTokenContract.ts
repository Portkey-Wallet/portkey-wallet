import { ChainType } from '@portkey-wallet/types';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService from 'service/SandboxEventService';

const getViewTokenContract = async ({
  rpcUrl,
  address,
  chainType,
}: {
  rpcUrl: string;
  address: string;
  chainType: ChainType;
}) => {
  if (!address) return;
  await SandboxEventService.dispatchAndReceive(SandboxEventTypes.initViewContract, {
    rpcUrl,
    address,
    chainType,
  });
};

export default getViewTokenContract;
