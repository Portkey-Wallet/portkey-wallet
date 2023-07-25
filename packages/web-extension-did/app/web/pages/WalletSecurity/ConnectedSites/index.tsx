import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
// import { useDapp, useWalletInfo } from 'store/Provider/hooks';
import SitesPopup from './Popup';
import SitesPrompt from './Prompt';
import { useCommonState } from 'store/Provider/hooks';
import { MenuItemInfo } from 'pages/components/MenuList';
import ImageDisplay from 'pages/components/ImageDisplay';
import './index.less';
import CustomSvg from 'components/CustomSvg';

const mockDapp = [
  {
    origin: 'origin',
    name: 'name',
    icon: 'icon',
  },
  {
    origin: 'origin1',
    name: 'name1',
    icon: 'icon1',
  },
];

export default function ConnectedSites() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const { currentNetwork } = useWalletInfo();
  // const { dappMap } = useDapp();
  // const currentDapp = useMemo(() => dappMap[currentNetwork] || [], [currentNetwork, dappMap]);
  const { isNotLessThan768 } = useCommonState();
  const isSafeOrigin = useCallback((origin: string) => origin.startsWith('https://'), []);

  const showDappList: MenuItemInfo[] = useMemo(
    () =>
      mockDapp?.map((dapp) => ({
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
          navigate(`/setting/wallet-security/connected-sites/${dapp.origin}`);
        },
      })),
    [isSafeOrigin, navigate],
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
