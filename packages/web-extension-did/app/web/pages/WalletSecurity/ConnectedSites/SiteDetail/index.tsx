import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import SiteDetailPrompt from './Prompt';
import SiteDetailPopup from './Popup';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';

const siteItem: DappStoreItem = {
  name: 'name',
  origin: 'origin',
  icon: 'icon',
};

export default function SiteDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isNotLessThan768 } = useCommonState();

  const title = t('Details');
  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/connected-sites');
  }, [navigate]);

  return isNotLessThan768 ? (
    <SiteDetailPrompt headerTitle={title} goBack={handleBack} siteItem={siteItem} />
  ) : (
    <SiteDetailPopup headerTitle={title} goBack={handleBack} siteItem={siteItem} />
  );
}
