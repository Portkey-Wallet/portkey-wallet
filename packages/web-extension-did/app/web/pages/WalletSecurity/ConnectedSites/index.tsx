import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useDapp, useWalletInfo } from 'store/Provider/hooks';
import SitesPopup from './Popup';
import SitesPrompt from './Prompt';
import { useCommonState } from 'store/Provider/hooks';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';

export default function ConnectedSites() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentNetwork } = useWalletInfo();
  const { dappMap } = useDapp();
  const currentDapp = useMemo(() => dappMap[currentNetwork] || [], [currentNetwork, dappMap]);
  const { isNotLessThan768 } = useCommonState();
  const dispatch = useAppDispatch();

  const handleDisConnect = useCallback(
    (item: DappStoreItem) => {
      dispatch(removeDapp({ networkType: currentNetwork, origin: item.origin || '' }));
    },
    [currentNetwork, dispatch],
  );

  const title = t('Connected Sites');
  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security');
  }, [navigate]);

  return isNotLessThan768 ? (
    <SitesPrompt headerTitle={title} goBack={handleBack} list={currentDapp} onDisconnect={handleDisConnect} />
  ) : (
    <SitesPopup headerTitle={title} goBack={handleBack} list={currentDapp} onDisconnect={handleDisConnect} />
  );
}
