import Loading from '@portkey-wallet/rn-components/components/Loading';
import { ITransferLimitItem } from 'model/security';
import { getUnlockedWallet } from 'model/wallet';
import { NetworkController } from 'network/controller';
import { useState, useCallback, useMemo } from 'react';

const PAYMENT_SECURITY_PAGE_LIMIT = 20;
export const useTransferLimitList = () => {
  const [isNext, setIsNext] = useState(false);
  const [pagination, setPagination] = useState<PaymentSecurityPagination>({
    page: 0,
    pageSize: PAYMENT_SECURITY_PAGE_LIMIT,
    total: -1,
    list: [],
  });
  const list = useMemo(() => pagination.list, [pagination.list]);

  const next = useCallback(
    async (isInit = false) => {
      const {
        caInfo: { caHash },
      } = await getUnlockedWallet();
      if (!caHash) return;
      Loading.show();
      const nextPagination: PaymentSecurityPagination = {
        page: 0,
        pageSize: PAYMENT_SECURITY_PAGE_LIMIT,
        total: -1,
        list: pagination.list,
      };
      if (isInit) {
        nextPagination.page = 0;
        nextPagination.total = -1;
        nextPagination.pageSize = PAYMENT_SECURITY_PAGE_LIMIT;
      } else if (nextPagination.page === 0) {
        isInit = true;
      }
      if (isInit) setIsNext(true);

      nextPagination.page++;
      const result = await NetworkController.fetchTransferLimitRule({
        caHash: caHash || '',
        skipCount: (nextPagination.page - 1) * nextPagination.pageSize,
        maxResultCount: nextPagination.pageSize,
      });
      Loading.hide();
      if (result.data && Array.isArray(result.data) && result.totalRecordCount !== undefined) {
        if (result.totalRecordCount <= (nextPagination.page - 1) * nextPagination.pageSize) {
          setIsNext(false);
          return;
        }
        if (result.totalRecordCount <= nextPagination.page * nextPagination.pageSize) {
          setIsNext(false);
        }
        nextPagination.total = result.totalRecordCount;
        nextPagination.list = result.data;
        setPagination(nextPagination);
        return;
      }
    },
    [pagination.list],
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

export interface PaymentSecurityPagination {
  page: number;
  pageSize: number;
  total: number;
  list: ITransferLimitItem[];
}
