import { ChainType } from '@portkey/provider-types';
import { ELF_DECIMAL } from '@portkey-wallet/constants/constants-ca/activity';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import { ZERO } from '@portkey-wallet/constants/misc';
import { GuardiansApprovedType } from 'types/guardians';
import { BaseToken } from '@portkey-wallet/types/types-eoa/token';
import { getChainIdByAddress } from '@portkey-wallet/utils';
import { getChainNumber } from '@portkey-wallet/utils/aelf';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { crossChainTransferToCa } from './crossChainTransferToCa';
import { getTokenIssueChainId } from './getTokenInfo';
import { managerTransfer } from './managerTransfer';

export interface CrossChainTransferParamsType {
  tokenInfo: BaseToken;
  chainType: ChainType;
  managerAddress: string;
  amount: number | string;
  memo?: string;
  toAddress: string;
}
export type CrossChainTransferIntervalParams = CrossChainTransferParamsType & {
  issueChainId: number;
};

export const intervalCrossChainTransfer = async (
  tokenContract: ContractBasic,
  params: CrossChainTransferIntervalParams,
) => {
  const { chainType, amount, tokenInfo, memo = '', toAddress, issueChainId } = params;
  // const issueChainId = getChainIdByAddress(managerAddress, chainType);
  const toChainId = getChainIdByAddress(toAddress, chainType);

  const paramsOption: any = {
    issueChainId,
    toChainId: getChainNumber(toChainId),
    symbol: tokenInfo.symbol,
    to: toAddress,
    amount,
  };
  if (memo) paramsOption.memo = memo;
  console.log('intervalCrossChainTransfer:paramsOption', paramsOption);

  let isError = true,
    count = 0;
  while (isError) {
    try {
      const crossChainResult = await crossChainTransferToCa({
        contract: tokenContract,
        paramsOption,
      });

      console.log('intervalCrossChainTransferResult', crossChainResult);
      if (crossChainResult.error) throw crossChainResult.error;
      isError = false;
    } catch (error) {
      isError = true;
      console.log(error, 'error===sendHandler--intervalCrossChainTransfer');
      count++;
      if (count >= 5) {
        throw {
          type: 'crossChainTransfer',
          error: error,
          data: params,
        };
      }
    }
  }
};

interface CrossChainTransferParams extends CrossChainTransferParamsType {
  tokenContract: ContractBasic;
  contract: ContractBasic;
  caHash: string;
  crossDefaultFee: number;
  guardiansApproved?: GuardiansApprovedType[];
}
const crossChainTransfer = async ({
  tokenInfo,
  chainType,
  managerAddress,
  amount,
  memo = '',
  toAddress,
  tokenContract,
  contract,
  caHash,
  crossDefaultFee,
  guardiansApproved,
}: CrossChainTransferParams) => {
  let managerTransferResult;
  const issueChainId = await getTokenIssueChainId({ tokenContract, paramsOption: { symbol: tokenInfo.symbol } });

  try {
    // first transaction:transfer to manager itself
    console.log('first transaction:transfer to manager itself Amount', amount);

    managerTransferResult = await managerTransfer({
      caContract: contract,
      tokenContractAddress: tokenInfo.tokenContractAddress || tokenInfo.address,
      caHash,
      paramsArgs: {
        symbol: tokenInfo.symbol,
        to: managerAddress,
        amount,
        memo,
      },
      guardiansApproved,
    });
    if (managerTransferResult.error) throw managerTransferResult.error;

    console.log(managerTransferResult, 'sendHandler===managerTransfer');
  } catch (error) {
    throw {
      type: 'managerTransfer',
      error: error,
    };
  }

  // second transaction:crossChain transfer to toAddress

  // TODO Only support chainType: aelf
  const crossChainTransferParams = {
    tokenInfo,
    chainType,
    managerAddress,
    amount:
      tokenInfo.symbol === ELF_SYMBOL
        ? ZERO.plus(amount).minus(timesDecimals(crossDefaultFee, ELF_DECIMAL)).toFixed()
        : amount,
    memo,
    toAddress,
    issueChainId,
  };

  try {
    await intervalCrossChainTransfer(tokenContract, crossChainTransferParams);
  } catch (error: any) {
    throw {
      ...error,
      managerTransferTxId: managerTransferResult.transactionId,
    };
  }
};

export default crossChainTransfer;
