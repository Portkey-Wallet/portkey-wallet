import { addDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import ImgLoading from 'components/ImgLoading';
import usePromptSearch from 'hooks/usePromptSearch';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useWalletInfo } from 'store/Provider/hooks';
import errorHandler from 'utils/errorHandler';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import './index.less';

const allowItem = [
  'viewing wallet balance and activity Allow',
  'sending requests for transactions',
  'moving funds without your permission',
];

export default function ConnectWallet() {
  const detail = usePromptSearch();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentNetwork } = useWalletInfo();
  const disabled = useMemo(() => !detail.origin, [detail]);

  const renderSite = useMemo(
    () =>
      detail && (
        <div className="site flex-center">
          <ImgLoading
            className="icon"
            src={detail.appLogo}
            loadEle={detail.appName?.[0]}
            errorEle={detail.appName?.[0]}
          />
          <span>{detail.appHref}</span>
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
              <span>{t('Allow')}</span>
            </div>
            <div className="allow-text">{item}</div>
          </div>
        ))}
      </div>
    ),
    [t],
  );

  const handleSign = useCallback(() => {
    dispatch(
      addDapp({
        networkType: currentNetwork,
        dapp: detail,
      }),
    );
    closePrompt({
      ...errorHandler(0),
      data: {},
    });
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
          {t('Sign')}
        </Button>
      </div>
    </div>
  );
}
