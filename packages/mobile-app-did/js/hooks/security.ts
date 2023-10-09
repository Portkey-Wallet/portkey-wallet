import { CheckTransferLimitParams, useCheckTransferLimit } from '@portkey-wallet/hooks/hooks-ca/security';
import { ChainId } from '@portkey-wallet/types';
import { checkSecurity } from '@portkey-wallet/utils/securityTest';
import ActionSheet from 'components/ActionSheet';
import { useCallback } from 'react';
import navigationService from 'utils/navigationService';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import WalletSecurityOverlay from 'components/WalletSecurityOverlay';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { guardianSyncingAlert } from 'utils/security';

export const useCheckTransferLimitWithJump = () => {
  const checkTransferLimit = useCheckTransferLimit();
  return useCallback(
    async (params: CheckTransferLimitParams, chainId: ChainId) => {
      const { symbol, decimals } = params;
      const checkTransferLimitResult = await checkTransferLimit(params);
      if (!checkTransferLimitResult) {
        throw new Error('Failed to fetch data');
      }
      const { isDailyLimited, isSingleLimited, dailyLimit, singleBalance, defaultDailyLimit, defaultSingleLimit } =
        checkTransferLimitResult;
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
                  transferLimitDetail: {
                    chainId,
                    symbol: symbol,
                    dailyLimit: dailyLimit.toFixed(0),
                    singleLimit: singleBalance.toFixed(0),
                    restricted: !dailyLimit.eq(-1),
                    decimals: decimals,
                    defaultDailyLimit: defaultDailyLimit?.toFixed(0),
                    defaultSingleLimit: defaultSingleLimit?.toFixed(0),
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

export const useSecuritySafeCheckAndToast = (): ((fromChainId?: ChainId) => Promise<boolean>) => {
  const { caHash } = useCurrentWalletInfo();
  const { originChainId } = useCurrentWalletInfo();

  return useLockCallback(
    async (fromChainId?: ChainId): Promise<boolean> => {
      // if fromChainId exit, use isOriginChainSafe to check, or use isTransferSafe & isSynchronizing
      if (!caHash) return false;

      const { isTransferSafe, isSynchronizing, isOriginChainSafe } = await checkSecurity(caHash);
      if (fromChainId && originChainId === fromChainId) {
        if (!isOriginChainSafe) WalletSecurityOverlay.alert();
        return isOriginChainSafe;
      }

      if (isTransferSafe) return true;
      if (isSynchronizing) {
        guardianSyncingAlert();
      } else {
        WalletSecurityOverlay.alert();
      }

      return false;
    },
    [caHash, originChainId],
  );
};
