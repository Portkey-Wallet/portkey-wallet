import { addDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { Button } from 'antd';
import usePromptSearch from 'hooks/usePromptSearch';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useWalletInfo } from 'store/Provider/hooks';
import errorHandler from 'utils/errorHandler';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import DappSession from 'pages/components/DappSession';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { useUpdateSessionInfo } from '@portkey-wallet/hooks/hooks-ca/dapp';
import getManager from 'utils/getManager';
import { useCheckSiteIsInBlackList } from '@portkey-wallet/hooks/hooks-ca/cms';
import AsyncButton from 'components/AsyncButton';
import './index.less';
import { useDappInfo } from '@portkey-wallet/hooks/hooks-ca/discover';
import { DappSiteInfo } from 'pages/components/DappSiteInfo';
import { CommonPromptCard } from '@portkey/did-ui-react';
import { PromptCardType } from 'pages/Send';
import Avatar from 'pages/components/Avatar';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';

export default function ConnectWallet() {
  const detail = usePromptSearch();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentNetwork } = useWalletInfo();
  const disabled = useMemo(() => !detail.appHref, [detail]);
  const [open, setOpen] = useState<boolean>(false);
  const [exp, setExp] = useState<SessionExpiredPlan>(SessionExpiredPlan.hour1);
  const updateSessionInfo = useUpdateSessionInfo();
  const checkOriginInBlackList = useCheckSiteIsInBlackList();
  const isInWebSet = useDappInfo(detail.appHref, detail.appLogo || '');

  const handleSessionChange = useCallback((flag: boolean, extTime: SessionExpiredPlan) => {
    setOpen(flag);
    setExp(extTime);
  }, []);

  const handleSign = useCallback(async () => {
    try {
      dispatch(
        addDapp({
          networkType: currentNetwork,
          dapp: {
            name: detail.appName,
            icon: detail.appLogo,
            origin: detail.appHref,
          },
        }),
      );
      if (open) {
        const manager = await getManager();
        updateSessionInfo({
          networkType: currentNetwork,
          origin: detail.appHref,
          expiredPlan: exp,
          manager,
        });
      }
      closePrompt({
        ...errorHandler(0),
        data: { origin: detail.appHref },
      });
    } catch (error) {
      console.log('add dapp error', error);
    }
  }, [currentNetwork, detail.appHref, detail.appLogo, detail.appName, dispatch, exp, open, updateSessionInfo]);

  const curDapp = useMemo(
    () => ({
      name: detail.appName,
      icon: detail.appLogo,
      origin: detail.appHref,
    }),
    [detail.appHref, detail.appLogo, detail.appName],
  );

  const userInfo = useCurrentUserInfo();

  return (
    <div className="connect-wallet">
      <div className="connect-wallet-body">
        <DappSiteInfo title="Connect" dappInfo={curDapp} />

        {!isInWebSet && (
          <CommonPromptCard
            className="warning-tip"
            type={PromptCardType.WARNING}
            description={`The dApp's contract address, logo, or domain may not be authentic. Please proceed with caution.`}
          />
        )}

        <div className="connect-wallet-content">
          <div className="connect-wallet-title">
            {`Connecting will allow this site to view balances and activity in your current account.`}
          </div>

          <div className="connect-wallet-user">
            <Avatar
              wrapperClass={'connect-wallet-user-avatar'}
              avatarUrl={userInfo.avatar}
              nameIndex={userInfo.nickName?.substring(0, 1).toLocaleUpperCase()}
            />
            <span className="connect-wallet-user-name">{userInfo.nickName}</span>
          </div>

          {!checkOriginInBlackList(detail.appHref) && <DappSession onChange={handleSessionChange} />}
        </div>
      </div>

      <div className="connect-wallet-footer">
        <div className="connect-wallet-footer-body">
          <Button
            onClick={() => {
              closePrompt({ ...errorHandler(200003) });
            }}>
            {t('Reject')}
          </Button>
          <AsyncButton disabled={disabled} type="primary" onClick={handleSign}>
            {t('Connect')}
          </AsyncButton>
        </div>

        <div className="connect-wallet-footer-tip">{'Only approve if you trust this website'}</div>
      </div>
    </div>
  );
}
