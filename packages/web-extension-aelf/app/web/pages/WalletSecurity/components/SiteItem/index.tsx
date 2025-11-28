import { Button, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { DappStoreItem } from '@portkey-wallet/store/store-eoa/dapp/type';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';
import { removeDapp } from '@portkey-wallet/store/store-eoa/dapp/actions';
import CustomSelect from 'pages/components/CustomSelect';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { useUpdateSessionInfo } from '@portkey-wallet/hooks/hooks-eoa/dapp';
import { formatTimeToStr, hasSessionInfoExpired } from '@portkey-wallet/utils/session';
import getManager from 'utils/getManager';
import { DAPP_SECURITY_DOMAIN_HINT, SessionKeyArray } from '@portkey-wallet/constants/constants-eoa/dapp';
import ImageDisplay from 'pages/components/ImageDisplay';
import { useCheckSiteIsInBlackList } from '@portkey-wallet/hooks/hooks-eoa/cms';
import { isSafeOrigin } from 'pages/WalletSecurity/utils';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { useDappInfo } from '@portkey-wallet/hooks/hooks-eoa/discover';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { PromptCardType } from '@portkey/did-ui-react/dist/_types/src/components/CommonPromptCard';
import { CommonPromptCard } from '@portkey/did-ui-react';
import MenuItem from 'components/MenuItem';
import { CustomModalBottom } from '../../../components/CustomModalBottom';
import './index.less';

export interface ISiteItemProps {
  siteItem: DappStoreItem;
}

export default function SiteItem({ siteItem }: ISiteItemProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentNetwork = useCurrentNetwork();
  const navigate = useNavigateState();
  const { sessionInfo } = siteItem;
  const [open, setOpen] = useState(!!sessionInfo?.expiredPlan);
  const updateSessionInfo = useUpdateSessionInfo();
  const checkSiteIsInBlackList = useCheckSiteIsInBlackList();
  const isInWebSet = useDappInfo(siteItem.origin, siteItem.icon || '');
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
        <div className={`site-dapp flex-column-center ${!isInWebSet && `margin-bottom16`}`}>
          <ImageDisplay defaultHeight={80} className="icon" src={siteItem.icon} backupSrc="Dapp=Others" />
          <span className="dapp-name">{siteItem.name}</span>
          <div className="origin flex-center">
            {!isSafeOrigin(siteItem.origin) && (
              <CustomSvgV3 type="warning" className="flex-center warning-icon" fillColor="#EB7D50" />
            )}
            <span>
              <a href={siteItem.origin} target="_blank" rel="noreferrer">
                {siteItem.origin}
              </a>
            </span>
          </div>
        </div>
        {!isInWebSet && (
          <CommonPromptCard
            className="warning-tip"
            title=""
            type={'warning' as PromptCardType}
            description={DAPP_SECURITY_DOMAIN_HINT}
          />
        )}
        <MenuItem height={54} showEnterIcon={false}>
          <div className="flex-between">
            <div className="label">{t('Connected time')}</div>
            <div className="time">{siteItem.connectedTime ? formatTimeToStr(siteItem.connectedTime) : '-'}</div>
          </div>
        </MenuItem>

        <div className="common-card">
          <div className="title title-container">
            <div className="flex-row-center">
              Remember me
              <CustomSvgV3
                onClick={() => {
                  CustomModalBottom({
                    isPrompt: true,
                    promptInfo: {
                      width: 343,
                    },
                    type: 'info',
                    title: t('Remember me'),
                    content: (
                      <div className="remember-me-content">
                        {t(
                          "Once enabled, your wallet will auto-approve all requests from this dApp on this device. You won't receive pop-up notifications for approvals until the session expires. This feature turns off automatically when you disconnect from the dApp or when the session expires. You can manually disable it or adjust the expiration time at any time.",
                        )}
                      </div>
                    ),
                    okText: t('OK'),
                  });
                }}
                type="help"
                className="help-icon"
                fillColor="#FFFFFFB3"
              />
            </div>
            <div>
              <Switch className="switch" checked={open} onChange={handleSwitch} />
            </div>
          </div>
          <div className="sub-content">{t('Disable to always require authentication for this dApp.')}</div>
        </div>

        {open && !isInBlackList && (
          <div className="content-item flex-column">
            <div className="label">{t('Session expires in')}</div>
            <CustomSelect
              className="site-item-select select-network"
              items={SessionKeyArray.filter((e) => e.value !== SessionExpiredPlan.always)}
              defaultValue={SessionExpiredPlan.hour1}
              value={sessionInfo?.expiredPlan}
              onChange={handleSessionChange}
              title={t('Session expires in')}
            />
          </div>
        )}
        {open && !isInBlackList && (
          <div className="expiration-time">
            {t('Expiration time')}:{' '}
            {sessionInfo?.expiredPlan === SessionExpiredPlan.never
              ? '-'
              : formatTimeToStr(sessionInfo?.expiredTime || 0)}
          </div>
        )}

        {/*{!isInBlackList && (*/}
        {/*  <div className="session-tip">*/}
        {/*    <span className="label">{t('Remember me to skip authentication')}</span>*/}
        {/*    <span className="value">*/}
        {/*      {t(*/}
        {/*        "Once enabled, your session key will automatically approve all requests from this DApp, on this device only. You won't see pop-up notifications asking for your approvals until the session key expires. This feature is automatically off when you disconnect from the DApp or when the session key expires. You can also manually disable it or change the expiration time.",*/}
        {/*      )}*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*)}*/}
        {/*{!isInBlackList && (*/}
        {/*  <div className="session-switch flex">*/}
        {/*    <Switch className="switch" checked={open} onChange={handleSwitch} />*/}
        {/*    <span className="status">{open ? 'Open' : 'Close'}</span>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
      <div className="btn-wrap">
        <Button className="disconnect-btn" onClick={handleDisconnect} type="default">
          {t('Disconnect')}
        </Button>
      </div>
    </div>
  );
}
