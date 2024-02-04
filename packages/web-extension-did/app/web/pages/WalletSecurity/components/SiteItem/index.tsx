import { Button, Switch } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useWalletInfo } from 'store/Provider/hooks';
import { removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import CustomSelect from 'pages/components/CustomSelect';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { useUpdateSessionInfo } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { formatTimeToStr, hasSessionInfoExpired } from '@portkey-wallet/utils/session';
import getManager from 'utils/getManager';
import { SessionKeyArray } from '@portkey-wallet/constants/constants-ca/dapp';
import ImageDisplay from 'pages/components/ImageDisplay';
import { useCheckSiteIsInBlackList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { isSafeOrigin } from 'pages/WalletSecurity/utils';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import './index.less';

export interface ISiteItemProps {
  siteItem: DappStoreItem;
}

export default function SiteItem({ siteItem }: ISiteItemProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentNetwork } = useWalletInfo();
  const navigate = useNavigateState();
  const { sessionInfo } = siteItem;
  const [open, setOpen] = useState(!!sessionInfo?.expiredPlan);
  const updateSessionInfo = useUpdateSessionInfo();
  const checkSiteIsInBlackList = useCheckSiteIsInBlackList();
  const isInBlackList = useMemo(
    () => checkSiteIsInBlackList(siteItem.origin),
    [checkSiteIsInBlackList, siteItem.origin],
  );

  useEffect(() => {
    if (siteItem.sessionInfo) {
      const isExp = hasSessionInfoExpired(siteItem.sessionInfo);
      if (isExp) {
        setOpen(!isExp);
        updateSessionInfo({ origin: siteItem.origin });
      }
    }
  }, [siteItem.origin, siteItem.sessionInfo, updateSessionInfo]);

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
        singleMessage.success('Session Key enabled');
      } else {
        updateSessionInfo({ origin: siteItem.origin });
        singleMessage.success('Session Key disabled');
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
        singleMessage.success('Session key updated');
      }
    },
    [currentNetwork, siteItem.origin, updateSessionInfo],
  );

  return (
    <div className="site-item-content flex-column-between flex-1">
      <div>
        <div className="site-dapp flex-column-center">
          <ImageDisplay defaultHeight={64} className="icon" src={siteItem.icon} backupSrc="DappDefault" />
          <span>{siteItem.name}</span>
          <div className="origin flex">
            <CustomSvg type={isSafeOrigin(siteItem.origin) ? 'DappLock' : 'DappWarn'} />
            <span>
              <a href={siteItem.origin} target="_blank" rel="noreferrer">
                {siteItem.origin}
              </a>
            </span>
          </div>
        </div>
        <div className="content-item flex-column">
          <div className="label">{t('Connected time')}</div>
          <div className="control flex">{siteItem.connectedTime ? formatTimeToStr(siteItem.connectedTime) : '-'}</div>
        </div>
        {!isInBlackList && (
          <div className="session-tip">
            <span className="label">{t('Remember me to skip authentication')}</span>
            <span className="value">
              {t(
                "Once enabled, your session key will automatically approve all requests from this DApp, on this device only. You won't see pop-up notifications asking for your approvals until the session key expires. This feature is automatically off when you disconnect from the DApp or when the session key expires. You can also manually disable it or change the expiration time.",
              )}
            </span>
          </div>
        )}
        {!isInBlackList && (
          <div className="session-switch flex">
            <Switch className="switch" checked={open} onChange={handleSwitch} />
            <span className="status">{open ? 'Open' : 'Close'}</span>
          </div>
        )}
        {open && !isInBlackList && (
          <div className="content-item flex-column">
            <div className="label">{t('Session key expires in')}</div>
            <CustomSelect
              items={SessionKeyArray}
              defaultValue={SessionExpiredPlan.hour1}
              value={sessionInfo?.expiredPlan}
              onChange={handleSessionChange}
            />
          </div>
        )}
        {open && !isInBlackList && (
          <div className="content-item flex-column">
            <div className="label">{t('Expiration time')}</div>
            <div className="control flex">
              {sessionInfo?.expiredPlan === SessionExpiredPlan.always
                ? '-'
                : formatTimeToStr(sessionInfo?.expiredTime || 0)}
            </div>
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
