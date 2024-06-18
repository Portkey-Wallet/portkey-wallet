import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import { ChainType } from '@portkey-wallet/types';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { isCrossChain } from '@portkey-wallet/utils/aelf';
import { divDecimalsStr } from '@portkey-wallet/utils/converter';
import getTransactionFee from 'utils/sandboxUtil/getTransactionFee';
import { isEqAddress } from '@portkey-wallet/utils/aelf';
import { ZERO } from '@portkey-wallet/constants/misc';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';

const getTransferFee = async ({
  caAddress,
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
  caAddress: string;
  managerAddress: string;
  chainInfo: IChainItemType;
  chainType: ChainType;
  privateKey: string;
  toAddress: string;
  token: BaseToken;
  caHash: string;
  amount: number | string;
  memo?: string;
}) => {
  if (isCrossChain(toAddress, chainInfo?.chainId ?? 'AELF')) {
    // first
    const firstTxResult = await getTransactionFee({
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
          to: managerAddress,
          amount,
          memo,
        },
      },
    });
    const { TransactionFees, TransactionFee } = firstTxResult.result;
    console.log('===getTransactionFee res', firstTxResult.result);
    if (TransactionFees) {
      const { Fee, ChargingAddress } = TransactionFees;
      const _fee = Fee?.[DEFAULT_TOKEN.symbol];
      const fee = divDecimalsStr(_fee, DEFAULT_TOKEN.decimals);
      // fee for free
      if (Number.isNaN(ZERO.plus(fee).toNumber())) {
        return '0';
      }
      if (ChargingAddress) {
        // no check manager address
        if (isEqAddress(caAddress, ChargingAddress)) {
          return fee;
        }
      }
      return '0';
    } else {
      const _fee = TransactionFee?.[DEFAULT_TOKEN.symbol];
      const fee = divDecimalsStr(_fee, DEFAULT_TOKEN.decimals);
      // fee for free
      if (Number.isNaN(ZERO.plus(fee).toNumber())) {
        return '0';
      }
      return fee;
    }
  } else {
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
    const { TransactionFees, TransactionFee } = transactionRes.result;
    if (TransactionFees) {
      const { Fee, ChargingAddress } = TransactionFees;
      const _fee = Fee?.[DEFAULT_TOKEN.symbol];
      const fee = divDecimalsStr(_fee, DEFAULT_TOKEN.decimals); // fee for free
      // fee for free
      if (Number.isNaN(ZERO.plus(fee).toNumber())) {
        return '0';
      }
      if (ChargingAddress) {
        if (isEqAddress(caAddress, ChargingAddress)) {
          return fee;
        } else {
          return '0';
        }
      }
      return fee;
    } else {
      const _fee = TransactionFee?.[DEFAULT_TOKEN.symbol];
      // fee for free
      if (Number.isNaN(ZERO.plus(_fee).toNumber())) {
        return '0';
      }
      return divDecimalsStr(_fee, DEFAULT_TOKEN.decimals);
    }
  }
};

export default getTransferFee;
