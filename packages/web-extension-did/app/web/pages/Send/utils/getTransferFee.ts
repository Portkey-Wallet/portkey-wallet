import { ZERO } from '@portkey-wallet/constants/misc';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { ChainType } from '@portkey-wallet/types';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { isCrossChain } from '@portkey-wallet/utils/aelf';
import { divDecimalsStr } from '@portkey-wallet/utils/converter';
import getTransactionFee from 'utils/sandboxUtil/getTransactionFee';

const getTransferFee = async ({
  managerAddress,
  toAddress,
  privateKey,
  chainInfo,
  chainType,
  token,
  caHash,
  amount,
  memo = '',
}: {
  managerAddress: string;
  chainInfo: ChainItemType;
  chainType: ChainType;
  privateKey: string;
  toAddress: string;
  token: BaseToken;
  caHash: string;
  amount: number;
  memo?: string;
}) => {
  if (isCrossChain(toAddress, chainInfo?.chainId ?? 'AELF')) {
    // first
    const firstTxResult = await getTransactionFee({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo?.endPoint || '',
      chainType,
      methodName: 'ManagerTransfer',
      privateKey,
      paramsOption: {
        caHash,
        symbol: token.symbol,
        to: managerAddress,
        amount,
        memo,
      },
    });
    const _firstFee = firstTxResult.result['ELF'];
    const firstFee = divDecimalsStr(ZERO.plus(_firstFee), 8);
    console.log(firstTxResult, 'transactionRes===cross');
    if (Number.isNaN(ZERO.plus(firstFee).toNumber())) {
      return '0';
    } else {
      return firstFee;
    }
  } else {
    //
    const transactionRes = await getTransactionFee({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo?.endPoint || '',
      chainType,
      methodName: 'ManagerForwardCall',
      privateKey,
      paramsOption: {
        caHash,
        contractAddress: token.address,
        methodName: 'Transfer',
        args: {
          symbol: token.symbol,
          to: toAddress,
          amount,
          memo,
        },
      },
    });
    console.log(transactionRes, 'transactionRes===');
    const feeRes = transactionRes.result['ELF'];
    return divDecimalsStr(ZERO.plus(feeRes), 8);
  }
};

export default getTransferFee;
