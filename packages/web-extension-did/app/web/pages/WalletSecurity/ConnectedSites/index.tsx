import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import SitesPopup from './Popup';
import SitesPrompt from './Prompt';
import { useCommonState } from 'store/Provider/hooks';
import { MenuItemInfo } from 'pages/components/MenuList';
import ImageDisplay from 'pages/components/ImageDisplay';
import CustomSvg from 'components/CustomSvg';
import { useCurrentDappList } from '@portkey-wallet/hooks/hooks-ca/dapp';
import './index.less';
import { isSafeOrigin } from '../utils';
import { useNavigateState } from 'hooks/router';

export default function ConnectedSites() {
  const { t } = useTranslation();
  const navigate = useNavigateState();
  const currentDapp = useCurrentDappList();
  const { isNotLessThan768 } = useCommonState();

  const showDappList: MenuItemInfo[] = useMemo(
    () =>
      (currentDapp ?? []).map((dapp) => ({
        key: dapp.origin,
        element: (
          <div className="content flex">
            <ImageDisplay defaultHeight={32} className="icon" src={dapp.icon} backupSrc="DappDefault" />
            <div className="desc flex-column">
              <div className="text name">
                <span className="dapp-name">{dapp.name}</span>
                <CustomSvg type={isSafeOrigin(dapp.origin) ? 'DappLock' : 'DappWarn'} />
              </div>
              <div className="text origin">{dapp.origin}</div>
            </div>
          </div>
        ),
        click: () => {
          navigate(`/setting/wallet-security/connected-sites/${encodeURIComponent(dapp.origin)}`);
        },
      })),
    [currentDapp, navigate],
  );

  const title = t('Connected Sites');
  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security');
  }, [navigate]);

  return isNotLessThan768 ? (
    <SitesPrompt headerTitle={title} goBack={handleBack} list={showDappList} />
  ) : (
    <SitesPopup headerTitle={title} goBack={handleBack} list={showDappList} />
  );
}
