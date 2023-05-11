import { ChainType } from '@portkey-wallet/types';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { getChainIdByAddress } from '@portkey-wallet/utils';
import { crossChainTransferToCa } from './crossChainTransferToCa';
import { managerTransfer } from './managerTransfer';
import { getChainNumber } from '@portkey-wallet/utils/aelf';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { ZERO } from '@portkey-wallet/constants/misc';
import { timesDecimals } from '@portkey-wallet/utils/converter';

export interface CrossChainTransferParamsType {
  tokenInfo: BaseToken;
  chainType: ChainType;
  managerAddress: string;
  amount: number | string;
  memo?: string;
  toAddress: string;
}

export const intervalCrossChainTransfer = async (
  tokenContract: ContractBasic,
  params: CrossChainTransferParamsType,
) => {
  const { managerAddress, chainType, amount, tokenInfo, memo = '', toAddress } = params;
  const issueChainId = getChainIdByAddress(managerAddress, chainType);
  const toChainId = getChainIdByAddress(toAddress, chainType);

  const paramsOption: any = {
    issueChainId: getChainNumber(issueChainId),
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
}: CrossChainTransferParams) => {
  let managerTransferResult;
  try {
    // first transaction:transfer to manager itself
    console.log('first transaction:transfer to manager itself Amount', amount);
    managerTransferResult = await managerTransfer({
      contract,
      paramsOption: {
        caHash,
        symbol: tokenInfo.symbol,
        to: managerAddress,
        amount,
        memo,
      },
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
    amount: tokenInfo.symbol === 'ELF' ? ZERO.plus(amount).minus(timesDecimals(0.35, 8)).toFixed() : amount,
    memo,
    toAddress,
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
