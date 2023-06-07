import { ZERO } from '@portkey-wallet/constants/misc';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { ChainType } from '@portkey-wallet/types';
import { divDecimalsStr } from '@portkey-wallet/utils/converter';
import getTransactionFee from 'utils/sandboxUtil/getTransactionFee';

const getTransferFee = async ({
  isCAManagerForwardCall,
  privateKey,
  contractAddress,
  chainInfo,
  chainType,
  paramsOption,
}: {
  isCAManagerForwardCall: boolean;
  paramsOption: any;
  contractAddress: string;
  chainInfo: ChainItemType;
  chainType: ChainType;
  privateKey: string;
}) => {
  let feeRes;
  if (isCAManagerForwardCall) {
    const transactionRes = await getTransactionFee({
      contractAddress: contractAddress,
      rpcUrl: chainInfo?.endPoint || '',
      chainType,
      methodName: 'ManagerForwardCall',
      privateKey,
      paramsOption,
    });
    feeRes = transactionRes.result['ELF'];
  } else {
    const firstTxResult = await getTransactionFee({
      contractAddress: contractAddress,
      rpcUrl: chainInfo?.endPoint || '',
      chainType,
      methodName: paramsOption.methodName,
      privateKey,
      paramsOption,
    });
    feeRes = firstTxResult.result['ELF'];
  }
  const fee = divDecimalsStr(ZERO.plus(feeRes), 8);
  if (Number.isNaN(ZERO.plus(fee).toNumber())) {
    return '0';
  } else {
    return fee;
  }
};

export default getTransferFee;
