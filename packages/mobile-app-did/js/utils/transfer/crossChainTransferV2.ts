import { SendOptions } from '@portkey-wallet/contracts/types';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { managerForwardCall } from './managerForwardCall';
import { GuardiansApprovedType } from '@portkey-wallet/types/types-ca/guardian';
import { ChainId } from '@portkey-wallet/types';
import { getTokenIssueChainId } from './getTokenInfo';
import { getChainNumber } from '@portkey-wallet/utils/aelf';

export const crossChainTransferV2 = async ({
  tokenContract,
  contract,
  caHash,
  amount,
  tokenInfo,
  memo = '',
  toAddress: to,
  toChainId,
  guardiansApproved,
}: {
  tokenContract: ContractBasic;
  contract: ContractBasic;
  tokenInfo: BaseToken;
  caHash: string;
  amount: number | string;
  toAddress: string;
  toChainId: ChainId;
  memo?: string;
  sendOptions?: SendOptions;
  guardiansApproved?: GuardiansApprovedType[];
}) => {
  const issueChainId = await getTokenIssueChainId({ tokenContract, paramsOption: { symbol: tokenInfo.symbol } });

  return managerForwardCall({
    contract,
    paramsOption: {
      caHash,
      contractAddress: tokenInfo.address,
      methodName: '.CrossChainTransfer',
      args: {
        symbol: tokenInfo.symbol,
        to,
        amount,
        memo,
        toChainId: getChainNumber(toChainId),
        issueChainId: issueChainId,
      },
      guardiansApproved,
    },
  });
};
