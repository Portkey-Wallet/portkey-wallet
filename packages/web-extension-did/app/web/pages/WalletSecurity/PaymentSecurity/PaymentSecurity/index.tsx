import { useCommonState } from 'store/Provider/hooks';
import PaymentSecurityPopup from './Popup';
import PaymentSecurityPrompt from './Prompt';
import { useTranslation } from 'react-i18next';
import { BaseHeaderProps } from 'types/UI';
import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { useCallback, useRef } from 'react';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useTransferLimitList } from '@portkey-wallet/hooks/hooks-ca/security';
import { useEffectOnce } from 'react-use';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { TTransferSettingLocationState } from 'types/router';

export interface IPaymentSecurityProps extends BaseHeaderProps {
  list: ITransferLimitItem[];
  clickItem: (item: ITransferLimitItem) => void;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  noDataText: string;
}

export default function PaymentSecurity() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const navigate = useNavigateState<TTransferSettingLocationState>();
  const headerTitle = t('Payment Security');
  const noDataText = t('No asset');
  const loadingFlag = useRef(false);

  const { list: securityList, pagination, init, next, isNext } = useTransferLimitList();

  const getSecurityList = useCallback(async () => {
    try {
      loadingFlag.current = true;

      await init();

      loadingFlag.current = false;
    } catch (error) {
      const msg = handleErrorMessage(error, 'get security error');
      singleMessage.error(msg);

      loadingFlag.current = false;
    }
  }, [init]);

  const handleClick = useCallback(
    (item: ITransferLimitItem) => {
      navigate('/setting/wallet-security/payment-security/transfer-settings', { state: item });
    },
    [navigate],
  );

  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security');
  }, [navigate]);

  const loadMoreSecurity = useCallback(async () => {
    if (loadingFlag.current) return;
    if (!securityList || (securityList?.length && securityList?.length === 0)) return;
    if (pagination?.total && securityList?.length >= pagination?.total) return;

    loadingFlag.current = true;
    try {
      if (isNext) {
        await next();
        loadingFlag.current = false;
      }
    } catch (error) {
      const msg = handleErrorMessage(error, 'get security error');
      singleMessage.error(msg);
      loadingFlag.current = false;
    }
  }, [isNext, next, pagination?.total, securityList]);

  useEffectOnce(() => {
    getSecurityList();
  });

  return isNotLessThan768 ? (
    <PaymentSecurityPrompt
      headerTitle={headerTitle}
      list={securityList}
      clickItem={handleClick}
      goBack={handleBack}
      hasMore={isNext}
      loadMore={loadMoreSecurity}
      noDataText={noDataText}
    />
  ) : (
    <PaymentSecurityPopup
      headerTitle={headerTitle}
      list={securityList}
      clickItem={handleClick}
      goBack={handleBack}
      hasMore={isNext}
      loadMore={loadMoreSecurity}
      noDataText={noDataText}
    />
  );
}
