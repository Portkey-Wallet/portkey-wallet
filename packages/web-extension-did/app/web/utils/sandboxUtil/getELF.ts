import { ChainType } from '@portkey-wallet/types';
import { managerForwardCall } from './managerForwardCall';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';

const getELF = async ({
  chainInfo,
  chainType,
  privateKey,
  caHash,
  amount,
  address,
}: {
  chainInfo: IChainItemType;
  chainType: ChainType;
  privateKey: string;
  caHash: string;
  address: string;
  amount: number;
}) => {
  await managerForwardCall({
    rpcUrl: chainInfo.endPoint,
    chainType,
    address: chainInfo.caContractAddress,
    privateKey,
    paramsOption: {
      caHash,
      contractAddress: address,
      methodName: 'ClaimToken',
      args: {
        symbol: 'ELF',
        amount,
      },
    },
  });
};

export default getELF;
