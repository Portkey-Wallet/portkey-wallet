import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import { ZERO } from '@portkey-wallet/constants/misc';
import { ChainType } from '@portkey-wallet/types';
import { divDecimalsStr } from '@portkey-wallet/utils/converter';
import getTransactionFee from 'utils/sandboxUtil/getTransactionFee';

const getTransferFee = async ({
  rpcUrl,
  contractAddress,
  paramsOption,
  chainType,
  methodName,
  privateKey,
}: {
  rpcUrl: string;
  contractAddress: string;
  chainType: ChainType;
  paramsOption: any;
  methodName: string;
  privateKey: string;
}) => {
  try {
    const transactionRes = await getTransactionFee({
      rpcUrl,
      contractAddress,
      paramsOption,
      chainType,
      methodName,
      privateKey,
    });
    const { TransactionFees, TransactionFee } = transactionRes.result;
    if (TransactionFees) {
      const { Fee } = TransactionFees;
      const feeRes = Fee?.[DEFAULT_TOKEN.symbol];
      const fee = divDecimalsStr(feeRes, DEFAULT_TOKEN.decimals);
      // fee for free
      if (Number.isNaN(ZERO.plus(fee).toNumber())) {
        return '0';
      }
      return fee;
    } else {
      const feeRes = TransactionFee?.[DEFAULT_TOKEN.symbol];
      const fee = divDecimalsStr(feeRes, DEFAULT_TOKEN.decimals);
      // fee for free
      if (Number.isNaN(ZERO.plus(fee).toNumber())) {
        return '0';
      }
      return fee;
    }
  } catch (error) {
    console.error('getTransactionFee', error);
    return '--';
  }
};

export default getTransferFee;
