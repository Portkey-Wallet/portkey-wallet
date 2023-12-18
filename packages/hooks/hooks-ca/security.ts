import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { useCurrentCaHash } from './wallet';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { ZERO } from '@portkey-wallet/constants/misc';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { useAppCASelector } from '.';
import { useCurrentNetworkInfo } from './network';
import { request } from '@portkey-wallet/api/api-did';
import { useAppCommonDispatch } from '../index';
import {
  nextTransferLimitList,
  setContactPrivacyList,
  setTransferLimitList,
  updateContactPrivacy,
  updateTransferLimit,
} from '@portkey-wallet/store/store-ca/security/actions';
import { IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';
import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';

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
  defaultDailyLimit?: BigNumber;
  defaultSingleLimit?: BigNumber;
};

export const useSecurityState = () => useAppCASelector(state => state.security);
export const useContactPrivacyListNetMap = () => useAppCASelector(state => state.security.contactPrivacyListNetMap);

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

export const useTransferLimitListNetMap = () => useAppCASelector(state => state.security.transferLimitListNetMap);

const PAYMENT_SECURITY_PAGE_LIMIT = 20;
export const useTransferLimitList = () => {
  const transferLimitListNetMap = useTransferLimitListNetMap();
  const { networkType } = useCurrentNetworkInfo();
  const [isNext, setIsNext] = useState(false);
  const caHash = useCurrentCaHash();
  const dispatch = useAppCommonDispatch();

  const listWithPagination = useMemo(
    () => transferLimitListNetMap?.[networkType],
    [transferLimitListNetMap, networkType],
  );

  const list = useMemo(() => listWithPagination?.list || [], [listWithPagination?.list]);

  const pagination = useMemo(() => listWithPagination?.pagination, [listWithPagination?.pagination]);

  const next = useCallback(
    async (isInit = false) => {
      const pagination = {
        page: 0,
        pageSize: PAYMENT_SECURITY_PAGE_LIMIT,
        total: -1,
        ...listWithPagination?.pagination,
      };
      if (isInit) {
        pagination.page = 0;
        pagination.total = -1;
        pagination.pageSize = PAYMENT_SECURITY_PAGE_LIMIT;
      } else if (pagination.page === 0) {
        isInit = true;
      }
      if (isInit) setIsNext(true);

      pagination.page++;
      const result = await request.security.securityList({
        params: {
          caHash,
          skipCount: (pagination.page - 1) * pagination.pageSize,
          maxResultCount: pagination.pageSize,
        },
      });

      if (result.data && Array.isArray(result.data) && result.totalRecordCount !== undefined) {
        if (result.totalRecordCount <= (pagination.page - 1) * pagination.pageSize) {
          setIsNext(false);
          return;
        }
        if (result.totalRecordCount <= pagination.page * pagination.pageSize) {
          setIsNext(false);
        }
        pagination.total = result.totalRecordCount;
        if (isInit) {
          dispatch(
            setTransferLimitList({
              network: networkType,
              value: {
                list: result.data,
                pagination,
              },
            }),
          );
        } else {
          dispatch(
            nextTransferLimitList({
              network: networkType,
              value: {
                list: result.data,
                pagination,
              },
            }),
          );
        }
        return;
      }
    },
    [caHash, dispatch, listWithPagination?.pagination, networkType],
  );

  const init = useCallback(() => next(true), [next]);

  return {
    list,
    pagination,
    init,
    next,
    isNext,
  };
};

export const useUpdateTransferLimit = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  return useCallback(
    (value: ITransferLimitItem) => {
      dispatch(
        updateTransferLimit({
          network: networkType,
          value,
        }),
      );
    },
    [dispatch, networkType],
  );
};
