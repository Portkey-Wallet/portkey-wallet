import { SendOptions } from 'packages/contracts/types';
import { GuardiansApprovedType } from 'packages/types/types-ca/routeParams';
import { ContractBasic } from '@portkey-wallet/utils/contract';
import { managerForwardCall } from './managerForwardCall';

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
