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
    const feeRes = transactionRes.result['ELF'];
    const fee = divDecimalsStr(ZERO.plus(feeRes), 8);
    if (Number.isNaN(ZERO.plus(fee).toNumber())) {
      return '0';
    } else {
      return fee;
    }
  } catch (error) {
    console.error('getTransactionFee', error);
    return '--';
  }
};

export default getTransferFee;
