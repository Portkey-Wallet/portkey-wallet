import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import SiteDetailPopup from './Popup';
import { useCurrentDappInfo } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { DefaultDapp } from '@portkey-wallet/constants/constants-ca/dapp';
import { useNavigateState } from 'hooks/router';

export default function SiteDetail() {
  const { t } = useTranslation();
  const navigate = useNavigateState();
  const { origin } = useParams();
  const curDapp = useCurrentDappInfo(origin || '') || DefaultDapp;

  useEffect(() => {
    if (curDapp.origin === 'default') {
      navigate('/setting/wallet-security/connected-sites');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curDapp.origin]);

  const title = t('dApp Details');
  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security/connected-sites');
  }, [navigate]);

  return <SiteDetailPopup headerTitle={title} goBack={handleBack} siteItem={curDapp} />;
}
