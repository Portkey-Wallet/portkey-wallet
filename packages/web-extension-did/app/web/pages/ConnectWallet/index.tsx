import { addDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import usePromptSearch from 'hooks/usePromptSearch';
import ImageDisplay from 'pages/components/ImageDisplay';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useWalletInfo } from 'store/Provider/hooks';
import errorHandler from 'utils/errorHandler';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import './index.less';

const allowItem = ['view wallet balance and activities', 'send you transaction requests'];

export default function ConnectWallet() {
  const detail = usePromptSearch();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentNetwork } = useWalletInfo();
  const disabled = useMemo(() => !detail.appHref, [detail]);

  const renderSite = useMemo(
    () =>
      detail && (
        <div className="site flex-center">
          <ImageDisplay defaultHeight={24} className="icon" src={detail.appLogo} backupSrc="DappDefault" />
          <span className="origin">{detail.appHref}</span>
        </div>
      ),
    [detail],
  );

  const renderAllow = useMemo(
    () => (
      <div className="allow">
        {allowItem.map((item) => (
          <div className="item" key={item}>
            <div className="flex allow-title">
              <CustomSvg type="TickFilled" className="flex-center" />
              <span>{t('Allow this site to')}</span>
            </div>
            <div className="allow-text">{item}</div>
          </div>
        ))}
      </div>
    ),
    [t],
  );

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
      closePrompt({
        ...errorHandler(0),
        data: { origin: detail.appHref },
      });
    } catch (error) {
      console.log('add dapp error', error);
    }
  }, [currentNetwork, detail, dispatch]);

  return (
    <div className="connect-wallet flex">
      {renderSite}
      <div className="title">{t('Connect with Portkey')}</div>
      {renderAllow}
      <div className="btn flex-between">
        <Button
          type="text"
          onClick={() => {
            closePrompt({ ...errorHandler(200003) });
          }}>
          {t('Reject')}
        </Button>
        <Button disabled={disabled} type="primary" onClick={handleSign}>
          {t('Approve')}
        </Button>
      </div>
    </div>
  );
}
