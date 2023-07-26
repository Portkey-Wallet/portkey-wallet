import { Button, Switch, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import { dateFullFormat } from 'utils';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useWalletInfo } from 'store/Provider/hooks';
import { removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { useNavigate } from 'react-router';
import CustomSelect from 'pages/components/CustomSelect';
import { SessionExpiredPlan, SessionExpiredPlanShow } from '@portkey-wallet/types/session';
import { useUpdateSessionInfo } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { hasSessionInfoExpired } from '@portkey-wallet/utils/session';
import getManager from 'utils/getManager';
import './index.less';

export interface ISiteItemProps {
  siteItem: DappStoreItem;
}

export default function SiteItem({ siteItem }: ISiteItemProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentNetwork } = useWalletInfo();
  const navigate = useNavigate();
  const { sessionInfo } = siteItem;
  const [open, setOpen] = useState(!!sessionInfo?.expiredPlan);
  const updateSessionInfo = useUpdateSessionInfo();
  console.log('sessionInfo', sessionInfo);

  useEffect(() => {
    if (siteItem.sessionInfo) {
      const isActive = hasSessionInfoExpired(siteItem.sessionInfo);
      setOpen(isActive);
    }
  }, [sessionInfo, siteItem.sessionInfo]);

  const handleSwitch = useCallback(
    async (value: boolean) => {
      setOpen(value);
      if (value) {
        const manager = await getManager();
        if (manager) {
          updateSessionInfo({
            networkType: currentNetwork,
            origin: siteItem.origin,
            expiredPlan: SessionExpiredPlan.hour1,
            manager,
          });
        }
        message.success('Session Key enabled');
      } else {
        updateSessionInfo({ origin: siteItem.origin });
        message.success('Session Key disabled');
      }
    },
    [currentNetwork, siteItem.origin, updateSessionInfo],
  );

  const handleDisconnect = useCallback(() => {
    dispatch(removeDapp({ networkType: currentNetwork, origin: siteItem.origin || '' }));
    navigate('/setting/wallet-security/connected-sites');
  }, [currentNetwork, dispatch, navigate, siteItem.origin]);

  const handleSessionChange = useCallback(
    async (value: SessionExpiredPlan) => {
      const manager = await getManager();
      if (manager) {
        updateSessionInfo({
          networkType: currentNetwork,
          origin: siteItem.origin,
          expiredPlan: value,
          manager,
        });
        message.success('Session key updated');
      }
    },
    [currentNetwork, siteItem.origin, updateSessionInfo],
  );

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
          <div className="control flex">{dateFullFormat(sessionInfo?.createTime)}</div>
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
          <Switch className="switch" checked={open} onChange={handleSwitch} />
          <span className="status">{open ? 'Open' : 'Close'}</span>
        </div>
        {open && (
          <div className="content-item flex-column">
            <div className="label">{t('Connected time')}</div>
            <CustomSelect
              items={SessionExpiredPlanShow}
              defaultValue={SessionExpiredPlan.hour1}
              value={sessionInfo?.expiredPlan}
              onChange={handleSessionChange}
            />
          </div>
        )}
        {open && (
          <div className="content-item flex-column">
            <div className="label">{t('Connected time')}</div>
            <div className="control flex">{dateFullFormat(sessionInfo?.expiredTime)}</div>
          </div>
        )}
      </div>
      <div className="btn-wrap">
        <Button onClick={handleDisconnect} type="default">
          {t('Disconnect')}
        </Button>
      </div>
    </div>
  );
}
