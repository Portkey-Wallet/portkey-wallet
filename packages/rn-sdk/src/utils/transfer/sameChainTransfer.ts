import { SendOptions } from 'packages/contracts/types';
import { GuardiansApprovedType } from 'packages/types/types-ca/routeParams';
import { BaseToken } from 'packages/types/types-eoa/token';
import { ContractBasic } from '@portkey-wallet/utils/contract';
import { managerForwardCall } from './managerForwardCall';

const sameChainTransfer = ({
  contract,
  caHash,
  amount,
  tokenInfo,
  memo = '',
  toAddress: to,
  guardiansApproved,
}: {
  contract: ContractBasic;
  tokenInfo: BaseToken;
  caHash: string;
  amount: number | string;
  toAddress: string;
  memo?: string;
  sendOptions?: SendOptions;
  guardiansApproved?: GuardiansApprovedType[];
}) => {
  return managerForwardCall({
    contract,
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
