import { CheckTransferLimitParams, useCheckTransferLimit } from '@portkey-wallet/hooks/hooks-ca/security';
import { ChainId } from '@portkey-wallet/types';
import ActionSheet from 'components/ActionSheet';
import { useCallback } from 'react';
import navigationService from 'utils/navigationService';
import { useCurrentWallet, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { checkSecuritySafe } from 'utils/security';
import { useGetTokenViewContract } from './contract';
import { getELFChainBalance } from '@portkey-wallet/utils/balance';
import { ZERO } from '@portkey-wallet/constants/misc';
import { MAX_TRANSACTION_FEE } from '@portkey-wallet/constants/constants-ca/wallet';
import { ApprovalType } from '@portkey-wallet/types/verifier';
import { NavigateMultiLevelParams } from 'types/navigate';

type CheckTransferLimitWithJumpParams = CheckTransferLimitParams & {
  balance?: string;
  chainId: ChainId;
  approveMultiLevelParams: NavigateMultiLevelParams;
};

export const useCheckTransferLimitWithJump = () => {
  const checkTransferLimit = useCheckTransferLimit();
  const getTokenViewContract = useGetTokenViewContract();
  const { walletInfo } = useCurrentWallet();

  return useCallback(
    async (params: CheckTransferLimitWithJumpParams) => {
      const { symbol, decimals, chainId, amount, approveMultiLevelParams } = params;
      let balance = params.balance;
      const checkTransferLimitResult = await checkTransferLimit(params);
      if (!checkTransferLimitResult) {
        throw new Error('Failed to fetch data');
      }
      const { isDailyLimited, isSingleLimited, dailyLimit, singleBalance, defaultDailyLimit, defaultSingleLimit } =
        checkTransferLimitResult;
      if (isDailyLimited || isSingleLimited) {
        if (balance === undefined) {
          const caAddress = walletInfo?.[chainId]?.caAddress;
          if (!caAddress) throw new Error('Failed to fetch data');

          const tokenViewContract = await getTokenViewContract(chainId);

          balance = await getELFChainBalance(tokenViewContract, symbol, caAddress);
        }

        // use MAX_TRANSACTION_FEE to make sure that transfer will success after approve
        const isAllowApprove = ZERO.plus(amount).plus(MAX_TRANSACTION_FEE).lt(balance);

        if (isAllowApprove) {
          // TODO: 1.4.13

          navigationService.navigateByMultiLevelParams('GuardianApproval', {
            params: {
              approvalType: ApprovalType.transferApprove,
            },
            multiLevelParams: approveMultiLevelParams,
          });
          return;
        }

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
    [checkTransferLimit, getTokenViewContract, walletInfo],
  );
};

export const useSecuritySafeCheckAndToast = (): ((fromChainId?: ChainId) => Promise<boolean>) => {
  const { caHash } = useCurrentWalletInfo();
  const { originChainId } = useCurrentWalletInfo();

  return useLockCallback(
    async (fromChainId?: ChainId): Promise<boolean> => {
      // if fromChainId exit, use isOriginChainSafe to check, or use isTransferSafe & isSynchronizing
      if (!caHash || !originChainId) return false;
      if (!fromChainId) fromChainId = originChainId;
      return checkSecuritySafe({
        caHash,
        originChainId,
        accelerateChainId: fromChainId,
      });
    },
    [caHash, originChainId],
  );
};
