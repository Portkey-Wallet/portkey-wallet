import { useCommonState } from 'store/Provider/hooks';
import PaymentSecurityPopup from './Popup';
import PaymentSecurityPrompt from './Prompt';
import { useTranslation } from 'react-i18next';
import { BaseHeaderProps } from 'types/UI';
import { IPaymentSecurityItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

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

export default function PaymentSecurity() {
  const { isNotLessThan768 } = useCommonState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const headerTitle = t('Payment Security');

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

  const loadMoreSecurity = useCallback(() => {
    // TODO
    console.log('load more');
    return Promise.resolve();
  }, []);

  return isNotLessThan768 ? (
    <PaymentSecurityPrompt
      headerTitle={headerTitle}
      list={mockList}
      clickItem={handleClick}
      goBack={handleBack}
      hasMore={false} // TODO
      loadMore={loadMoreSecurity}
    />
  ) : (
    <PaymentSecurityPopup
      headerTitle={headerTitle}
      list={mockList}
      clickItem={handleClick}
      goBack={handleBack}
      hasMore={false} // TODO
      loadMore={loadMoreSecurity}
    />
  );
}
