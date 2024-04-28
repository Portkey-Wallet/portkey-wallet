import { SendOptions } from '@portkey-wallet/contracts/types';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { managerForwardCall } from './managerForwardCall';
import { GuardiansApprovedType } from '@portkey-wallet/types/types-ca/guardian';

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
