import { useCommonState, useLoading } from 'store/Provider/hooks';
import PaymentSecurityPopup from './Popup';
import PaymentSecurityPrompt from './Prompt';
import { useTranslation } from 'react-i18next';
import { BaseHeaderProps } from 'types/UI';
import { IPaymentSecurityItem, ISecurityListResponse } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { request } from '@portkey-wallet/api/api-did';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';

const mockList: IPaymentSecurityItem[] = [
  {
    chainId: 'AELF',
    symbol: 'ELF',
    singleLimit: 100,
    dailyLimit: 1000,
    restricted: true,
  },
  {
    chainId: 'tDVV',
    symbol: 'ELF',
    singleLimit: -1,
    dailyLimit: -1,
    restricted: false,
  },
];

export interface IPaymentSecurityProps extends BaseHeaderProps {
  list: IPaymentSecurityItem[];
  clickItem: (item: IPaymentSecurityItem) => void;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

const MAX_RESULT_COUNT = 20;
const SKIP_COUNT = 0;

export default function PaymentSecurity() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const headerTitle = t('Payment Security');
  const wallet = useCurrentWalletInfo();
  const [securityList, setSecurityList] = useState<IPaymentSecurityItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const loadingFlag = useRef(false);
  const { setLoading } = useLoading();

  const getSecurityList = useCallback(async () => {
    try {
      setLoading(true);
      loadingFlag.current = true;

      const res: ISecurityListResponse = await request.security.securityList({
        params: {
          caHash: wallet?.caHash || '',
          skipCount: SKIP_COUNT,
          maxResultCount: MAX_RESULT_COUNT,
        },
      });
      res?.data && setSecurityList(res.data);
      res?.totalRecordCount && setTotalCount(res.totalRecordCount);

      setLoading(false);
      loadingFlag.current = false;
    } catch (error) {
      const msg = handleErrorMessage(error, 'get security error');
      message.error(msg);

      setLoading(false);
      loadingFlag.current = false;
    }
  }, [setLoading, wallet?.caHash]);

  const handleClick = useCallback(
    (item: IPaymentSecurityItem) => {
      console.log('🌈 🌈 🌈 🌈 🌈 🌈 item', item);
      navigate('/setting/wallet-security/payment-security/transfer-settings', { state: item });
    },
    [navigate],
  );

  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security');
  }, [navigate]);

  const loadMoreSecurity = useCallback(async () => {
    if (loadingFlag.current) return;

    loadingFlag.current = true;
    try {
      if (securityList?.length < totalCount) {
        const res: ISecurityListResponse = await request.security.securityList({
          params: {
            caHash: wallet?.caHash || '',
            skipCount: securityList?.length,
            maxResultCount: MAX_RESULT_COUNT,
          },
        });
        res?.data && setSecurityList(securityList.concat(res.data));
        res?.totalRecordCount && setTotalCount(res.totalRecordCount);

        loadingFlag.current = false;
      }
    } catch (error) {
      const msg = handleErrorMessage(error, 'get security error');
      message.error(msg);
      loadingFlag.current = false;
    }
  }, [loadingFlag, securityList, totalCount, wallet?.caHash]);

  useEffect(() => {
    // getSecurityList();
  }, [getSecurityList]);

  return isNotLessThan768 ? (
    <PaymentSecurityPrompt
      headerTitle={headerTitle}
      list={mockList}
      clickItem={handleClick}
      goBack={handleBack}
      hasMore={false}
      loadMore={loadMoreSecurity}
    />
  ) : (
    <PaymentSecurityPopup
      headerTitle={headerTitle}
      list={mockList}
      clickItem={handleClick}
      goBack={handleBack}
      hasMore={false}
      loadMore={loadMoreSecurity}
    />
  );
}
