import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import SitesPopup from './Popup';
import { MenuItemInfo } from 'pages/components/MenuList';
import ImageDisplay from 'pages/components/ImageDisplay';
import { useCurrentDappList } from '@portkey-wallet/hooks/hooks-eoa/dapp';
import './index.less';
import { isSafeOrigin } from '../utils';
import { useNavigateState } from 'hooks/router';
import { CustomSvgV3 } from 'components/CustomSvgV3';

export default function ConnectedSites() {
  const { t } = useTranslation();
  const navigate = useNavigateState();
  const currentDapp = useCurrentDappList();

  const showDappList: MenuItemInfo[] = useMemo(
    () =>
      (currentDapp ?? []).map((dapp) => ({
        key: dapp.origin,
        element: (
          <div className="content flex">
            <ImageDisplay defaultHeight={42} className="icon" src={dapp.icon} backupSrc="Dapp=Others" />
            <div className="desc flex-column">
              <div className="text name">
                <span className="dapp-name">{dapp.name ?? 'Unknown'}</span>
                {!isSafeOrigin(dapp.origin) && (
                  <CustomSvgV3 type="warning" className="warning-icon" fillColor="#EB7D50" />
                )}
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

  const title = t('Connected dApps');
  const handleBack = useCallback(() => {
    navigate('/setting');
  }, [navigate]);

  return <SitesPopup headerTitle={title} goBack={handleBack} list={showDappList} />;
}
