import { CheckTransferLimitParams, useCheckTransferLimit } from '@portkey-wallet/hooks/hooks-ca/security';
import { ChainId } from '@portkey-wallet/types';
import ActionSheet from 'components/ActionSheet';
import { useCallback } from 'react';
import navigationService from 'utils/navigationService';

export const useCheckTransferLimitWithJump = () => {
  const checkTransferLimit = useCheckTransferLimit();
  return useCallback(
    async (params: CheckTransferLimitParams, chainId: ChainId) => {
      const { symbol, decimals } = params;
      const checkTransferLimitResult = await checkTransferLimit(params);
      if (!checkTransferLimitResult) {
        throw new Error('Failed to fetch data');
      }
      const { isDailyLimited, isSingleLimited, dailyLimit, singleBalance } = checkTransferLimitResult;
      if (isDailyLimited || isSingleLimited) {
        ActionSheet.alert({
          title2: isDailyLimited
            ? 'Maximum daily limit exceeded. To proceed, please modify the transfer limit first.'
            : 'Maximum limit per transaction exceeded. To proceed, please modify the transfer limit first. ',
          buttons: [
            {
              title: 'Cancel',
              type: 'outline',
            },
            {
              title: 'Modify',
              onPress: async () => {
                navigationService.navigate('PaymentSecurityEdit', {
                  paymentSecurityDetail: {
                    chainId,
                    symbol: symbol,
                    dailyLimit: dailyLimit.toString(),
                    singleLimit: singleBalance.toString(),
                    restricted: !dailyLimit.eq(-1),
                    decimals: decimals,
                  },
                });
              },
            },
          ],
        });
        return false;
      }
      return true;
    },
    [checkTransferLimit],
  );
};
