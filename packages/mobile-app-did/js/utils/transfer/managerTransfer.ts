import { SendOptions } from '@portkey-wallet/contracts/types';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { managerForwardCall } from './managerForwardCall';
import { GuardiansApprovedType } from '@portkey-wallet/types/types-ca/guardian';

export const managerTransfer = ({
  caContract,
  tokenContractAddress,
  caHash,
  paramsArgs,
  sendOptions,
  guardiansApproved,
}: {
  caContract: ContractBasic;
  tokenContractAddress: string;
  caHash: string;
  paramsArgs: { symbol: string; to: string; amount: number | string; memo?: string };
  sendOptions?: SendOptions;
  guardiansApproved?: GuardiansApprovedType[];
}) => {
  return managerForwardCall({
    contract: caContract,
    paramsOption: {
      caHash: caHash,
      contractAddress: tokenContractAddress,
      methodName: 'Transfer',
      args: paramsArgs,
      guardiansApproved,
    },
    sendOptions,
  });
};
