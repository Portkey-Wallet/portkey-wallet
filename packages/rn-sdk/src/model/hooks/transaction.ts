import { CheckTransactionFeeResult } from 'network/dto/transaction';
import { useState } from 'react';
import { useIntervalPolling } from './interval';
import { NetworkController } from 'network/controller';
import isDeepEqual from 'fast-deep-equal/react';

const INIT_TRANSACTION_FEE_ITEM: CheckTransactionFeeResult = ['AELF', 'tDVV', 'tDVW'].map(chainId => ({
  chainId,
  transactionFee: {
    ach: '0.000',
    crossChain: '0.000',
    max: '0.000',
    redPackage: '0.000',
  },
}));

export const useTransactionFee = (fromChainId: string) => {
  const [transactionFee, setTransactionFee] = useState<CheckTransactionFeeResult>(INIT_TRANSACTION_FEE_ITEM);
  useIntervalPolling({
    fetcher: async () => {
      const result = await NetworkController.getTransactionFee({
        chainIds: [fromChainId],
      });
      return result;
    },
    updater: result => {
      if (!isDeepEqual(transactionFee, result)) {
        setTransactionFee(result);
      }
    },
  });
  return transactionFee;
};
