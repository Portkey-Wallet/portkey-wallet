import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { ChainType } from '@portkey-wallet/types';
import { managerForwardCall } from './managerForwardCall';

const getELF = async ({
  chainInfo,
  chainType,
  privateKey,
  caHash,
  amount,
  address,
}: {
  chainInfo: ChainItemType;
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
