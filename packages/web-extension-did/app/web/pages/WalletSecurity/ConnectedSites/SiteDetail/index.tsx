import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import SiteDetailPrompt from './Prompt';
import SiteDetailPopup from './Popup';
import { useCurrentDappInfo } from '@portkey-wallet/hooks/hooks-ca/dapp';

export default function SiteDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { origin } = useParams();
  const { isNotLessThan768 } = useCommonState();
  const curDapp = useCurrentDappInfo(origin || '');

  const title = t('Details');
  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/connected-sites');
  }, [navigate]);

  return isNotLessThan768 ? (
    <SiteDetailPrompt headerTitle={title} goBack={handleBack} siteItem={curDapp!} />
  ) : (
    <SiteDetailPopup headerTitle={title} goBack={handleBack} siteItem={curDapp!} />
  );
}
