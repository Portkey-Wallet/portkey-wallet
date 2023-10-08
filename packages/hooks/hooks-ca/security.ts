import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { useCurrentCaHash } from './wallet';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { ZERO } from '@portkey-wallet/constants/misc';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { useAppCASelector } from '.';
import { useCurrentNetworkInfo } from './network';
import { request } from '@portkey-wallet/api/api-did';
import { useAppCommonDispatch } from '../index';
import { setContactPrivacyList, updateContactPrivacy } from '@portkey-wallet/store/store-ca/security/actions';
import { IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';

export type CheckTransferLimitParams = {
  caContract: ContractBasic;
  symbol: string;
  decimals: number | string;
  amount: string;
};

export type CheckTransferLimitResult = {
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
};

export function useCheckTransferLimit() {
  const caHash = useCurrentCaHash();
  return useCallback(
    async (params: CheckTransferLimitParams): Promise<CheckTransferLimitResult | undefined> => {
      const { caContract, symbol, decimals, amount } = params;
      const [limitReq, defaultLimitReq] = await Promise.all([
        caContract.callViewMethod('GetTransferLimit', {
          caHash: caHash,
          symbol: symbol,
        }),
        caContract.callViewMethod('GetDefaultTokenTransferLimit', {
          caHash: caHash,
          symbol: symbol,
        }),
      ]);
      const bigAmount = timesDecimals(amount, decimals);
      let dailyBalance, singleBalance, dailyLimit;
      if (!limitReq?.error) {
        const { singleLimit, dailyLimit: contractDailyLimit, dailyTransferredAmount } = limitReq.data || {};
        dailyLimit = ZERO.plus(contractDailyLimit);
        dailyBalance = dailyLimit.minus(dailyTransferredAmount);
        singleBalance = ZERO.plus(singleLimit);
      } else if (!defaultLimitReq?.error) {
        const { defaultLimit } = defaultLimitReq.data || {};
        dailyLimit = ZERO.plus(defaultLimit);
        dailyBalance = dailyLimit;
        singleBalance = ZERO.plus(defaultLimit);
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
      };
    },
    [caHash],
  );
}

export type GetTransferLimitParams = {
  caContract: ContractBasic;
  symbol: string;
};

export type GetTransferLimitResult = {
  dailyLimit: string;
  singleLimit: string;
  restricted: boolean;
};

export function useGetTransferLimit() {
  const caHash = useCurrentCaHash();

  return useCallback(
    async (params: GetTransferLimitParams): Promise<GetTransferLimitResult | undefined> => {
      const { caContract, symbol } = params;
      const limitReq = await caContract.callViewMethod('GetTransferLimit', {
        caHash: caHash,
        symbol: symbol,
      });

      if (!limitReq?.error) {
        const { singleLimit, dailyLimit } = limitReq.data || {};

        return {
          dailyLimit,
          singleLimit,
          restricted: dailyLimit != '-1' && singleLimit != '-1',
        };
      }
      return;
    },
    [caHash],
  );
}

export const useSecurityState = () => useAppCASelector(state => state.security);
export const useContactPrivacyListNetMap = () => useAppCASelector(state => state.security.contactPrivacyListNetMap);

export const useContactPrivacyList = () => {
  const contactPrivacyListNetMap = useContactPrivacyListNetMap();
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const list = useMemo(() => contactPrivacyListNetMap[networkType] || [], [contactPrivacyListNetMap, networkType]);

  const refresh = useCallback(async () => {
    const result = await request.contact.contactPrivacyList();
    if (result?.permissions && Array.isArray(result.permissions)) {
      dispatch(
        setContactPrivacyList({
          network: networkType,
          list: result.permissions,
        }),
      );
    } else {
      throw result;
    }
  }, [dispatch, networkType]);

  const update = useCallback(
    async (value: IContactPrivacy) => {
      await request.contact.updateContactPrivacy({
        params: {
          identifier: value.identifier,
          privacyType: value.privacyType,
          permission: value.permission,
        },
      });
      dispatch(
        updateContactPrivacy({
          network: networkType,
          value,
        }),
      );
    },
    [dispatch, networkType],
  );

  return {
    list,
    refresh,
    update,
  };
};
