import { Button, Switch } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
// import { dateFormat } from 'utils';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { useCallback } from 'react';
import { useAppDispatch, useWalletInfo } from 'store/Provider/hooks';
import { removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { useNavigate } from 'react-router';
import './index.less';
import CustomSelect from 'pages/components/CustomSelect';

export interface ISiteItemProps {
  siteItem: DappStoreItem;
}

export default function SiteItem({ siteItem }: ISiteItemProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentNetwork } = useWalletInfo();
  const navigate = useNavigate();

  const handleSwitch = useCallback(() => {
    //
  }, []);

  const handleDisconnect = useCallback(() => {
    dispatch(removeDapp({ networkType: currentNetwork, origin: siteItem.origin || '' }));
    navigate('/setting/wallet-security/connected-sites');
  }, [currentNetwork, dispatch, navigate, siteItem.origin]);

  const SessionExpiredPlan = [
    {
      value: '1',
      children: '1 hour',
    },
    {
      value: '3',
      children: '3 hour',
    },
    {
      value: '12',
      children: '12 hour',
    },
    {
      value: '24',
      children: '24 hour',
    },
    {
      value: 'never',
      children: 'Never',
    },
  ];

  const handleSessionChange = useCallback(() => {
    //
  }, []);

  return (
    <div className="site-item-content flex-column-between flex-1">
      <div>
        <div className="site-dapp flex-column-center">
          <CustomSvg type="DappDefault" />
          <div>{siteItem.name}</div>
          <div className="origin flex">
            <CustomSvg type="DappWarn" />
            <span>{siteItem.origin}</span>
          </div>
        </div>
        <div className="content-item flex-column">
          <div className="label">{t('Connected time')}</div>
          <div className="control flex">2023-07-30 23:59:59</div>
        </div>
        <div className="session-tip">
          <span className="label">{t('Remember me to skip authentication')}</span>
          <span className="value">
            {t(
              "Once enabled, your session key will automatically approve all requests from this DApp, on this device only. You won't see pop-up notifications asking for your approvals until the session key expires. This feature is automatically off when you disconnect from the DApp or when the session key expires. You can also manually disable it or change the expiration time.",
            )}
          </span>
        </div>
        <div className="session-switch flex">
          <Switch className="switch" checked={false} onChange={handleSwitch} />
          <span className="status">Close</span>
        </div>
        <div className="content-item flex-column">
          <div className="label">{t('Connected time')}</div>
          <CustomSelect items={SessionExpiredPlan} defaultValue={'1'} value={'1'} onChange={handleSessionChange} />
        </div>
        <div className="content-item flex-column">
          <div className="label">{t('Connected time')}</div>
          <div className="control flex">2023-07-30 23:59:59</div>
        </div>
      </div>
      <div className="btn-wrap">
        <Button onClick={handleDisconnect} type="default">
          {t('Disconnect')}
        </Button>
      </div>
    </div>
  );
}
