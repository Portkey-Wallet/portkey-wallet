import { SendOptions } from '@portkey-wallet/contracts/types';
import { BaseToken } from '@portkey-wallet/types/types-eoa/token';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { managerForwardCall } from './managerForwardCall';
import { GuardiansApprovedType } from 'types/guardians';

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
