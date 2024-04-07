import { getCachedAllChainInfo } from 'model/chain';
import { getUnlockedWallet } from 'model/wallet';
import { AElfChainStatusItemDTO } from 'network/dto/wallet';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { ChainId } from '@portkey-wallet/types';
import { useCallback, useEffect, useState } from 'react';
import { checkSecuritySafe } from 'utils/security';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { ZERO } from '@portkey-wallet/constants/misc';
import ActionSheet from '@portkey-wallet/rn-components/components/ActionSheet';
import BigNumber from 'bignumber.js';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PaymentSecurityEditProps } from 'pages/My/WalletSecurity/PaymentSecurity/PaymentSecurityEdit';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import { callGetDefaultTransferLimitMethod, callGetTransferLimitMethod } from 'model/contract/handler';

interface WalletInfo {
  caHash?: string;
  managerAddress?: string;
  originChainId: ChainId;
  caAddress?: string;
}
export function useCurrentWalletInfo() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    caHash: '',
    managerAddress: '',
    originChainId: 'AELF',
  });
  useEffect(() => {
    (async () => {
      const { caInfo, address: managerAddress, originChainId } = await getUnlockedWallet();
      setWalletInfo({
        caHash: caInfo?.caHash,
        managerAddress,
        originChainId: originChainId as ChainId,
        caAddress: caInfo?.caAddress,
      });
    })();
  }, []);
  return walletInfo;
}

export function useGetChainInfo() {
  const [chainInfoList, setChainInfoList] = useState<Array<AElfChainStatusItemDTO>>();
  useEffect(() => {
    async function fetchData() {
      const response = await getCachedAllChainInfo();
      setChainInfoList(response);
    }
    fetchData();
  }, []);
  const getChainInfo = useCallback(
    (chainId: ChainId) => {
      return chainInfoList?.find(item => item.chainId === chainId);
    },
    [chainInfoList],
  );
  return getChainInfo;
}

export const useSecuritySafeCheckAndToast = (): ((fromChainId?: ChainId) => Promise<boolean>) => {
  const { caHash, originChainId } = useCurrentWalletInfo();

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

export const useCheckTransferLimitWithJump = () => {
  const checkTransferLimit = useCheckTransferLimit();
  const { navigateTo } = useBaseContainer({});
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
                navigateTo<PaymentSecurityEditProps>(PortkeyEntries.PAYMENT_SECURITY_EDIT_ENTRY, {
                  params: {
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
    [checkTransferLimit, navigateTo],
  );
};

function useCheckTransferLimit() {
  return useCallback(async (params: CheckTransferLimitParams): Promise<CheckTransferLimitResult | undefined> => {
    const { chainId, symbol, decimals, amount } = params;
    const [limitReq, defaultLimitReq] = await Promise.all([
      callGetTransferLimitMethod(chainId, symbol),
      callGetDefaultTransferLimitMethod(chainId, symbol),
    ]);
    const bigAmount = timesDecimals(amount, decimals);
    let dailyBalance, singleBalance, dailyLimit, defaultDailyLimit, defaultSingleLimit;
    if (!limitReq?.error) {
      const { singleLimit, dailyLimit: contractDailyLimit, dailyTransferredAmount } = limitReq.data || {};
      dailyLimit = ZERO.plus(contractDailyLimit);
      dailyBalance = dailyLimit.minus(dailyTransferredAmount);
      singleBalance = ZERO.plus(singleLimit);
    }
    if (!defaultLimitReq?.error) {
      const { transferLimit } = defaultLimitReq.data || {};
      const { dayLimit, singleLimit } = transferLimit || {};
      defaultDailyLimit = ZERO.plus(dayLimit);
      defaultSingleLimit = ZERO.plus(singleLimit);
    }

    if (!dailyLimit || !dailyBalance || !singleBalance || dailyBalance.isNaN() || singleBalance.isNaN()) return;
    return {
      isDailyLimited: !dailyLimit.eq(-1) && bigAmount.gt(dailyBalance),
      isSingleLimited: !singleBalance.eq(-1) && bigAmount.gt(singleBalance),
      dailyLimit,
      showDailyLimit: divDecimals(dailyLimit, decimals),
      dailyBalance,
      showDailyBalance: divDecimals(dailyBalance, decimals),
      singleBalance,
      showSingleBalance: divDecimals(singleBalance, decimals),
      defaultDailyLimit,
      defaultSingleLimit,
    };
  }, []);
}
// type for TransferLimit check
type CheckTransferLimitParams = {
  // caContract: ContractBasic;
  chainId: ChainId;
  symbol: string;
  decimals: number | string;
  amount: string;
};

type CheckTransferLimitResult = {
  isDailyLimited: boolean;
  isSingleLimited: boolean;
  // balances with decimals processed
  showDailyLimit: BigNumber;
  // balances with decimals processed
  showDailyBalance: BigNumber;
  // balances with decimals processed
  showSingleBalance: BigNumber;
  dailyLimit: BigNumber;
  dailyBalance: BigNumber;
  singleBalance: BigNumber;
  defaultDailyLimit?: BigNumber;
  defaultSingleLimit?: BigNumber;
};
