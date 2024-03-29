import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { ChainType } from '@portkey-wallet/types';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { managerForwardCall } from './managerForwardCall';
import { GuardianItem } from 'types/guardians';

const sameChainTransfer = async ({
  chainInfo,
  chainType,
  privateKey,
  caHash,
  amount,
  tokenInfo,
  memo = '',
  toAddress: to,
  guardiansApproved,
}: {
  chainInfo: ChainItemType;
  chainType: ChainType;
  privateKey: string;
  tokenInfo: BaseToken;
  caHash: string;
  amount: number | string;
  toAddress: string;
  memo?: string;
  guardiansApproved?: GuardianItem[];
}) => {
  return managerForwardCall({
    rpcUrl: chainInfo.endPoint,
    chainType,
    address: chainInfo.caContractAddress,
    privateKey,
    paramsOption: {
      caHash,
      contractAddress: tokenInfo.address,
      methodName: 'Transfer',
      args: {
        symbol: tokenInfo.symbol,
        to,
        amount,
        memo,
      },
      guardiansApproved,
    },
  });
};

export default sameChainTransfer;
