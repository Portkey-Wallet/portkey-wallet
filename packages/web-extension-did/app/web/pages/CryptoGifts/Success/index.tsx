import CustomSvg from 'components/CustomSvg';
import { Button } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useCopyToClipboard } from 'react-use';
import singleMessage from 'utils/singleMessage';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import { FromPageEnum, TCryptoGiftDetailLocationState } from 'types/router';
import { useLocationState, useNavigateState } from 'hooks/router';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useLocation } from 'react-router';
import { useEffectOnce } from '@portkey-wallet/hooks';
import googleAnalytics from 'utils/googleAnalytics';
import './index.less';
import { useGetCryptoGiftTgLink } from '@portkey-wallet/hooks/hooks-ca/cryptogift';

export default function SuccessPage() {
  const navigate = useNavigateState<TCryptoGiftDetailLocationState>();
  const { state } = useLocationState<TCryptoGiftDetailLocationState>();
  const { cryptoGiftUrl } = useCurrentNetworkInfo();
  const location = useLocation();
  const getCryptoGiftTgLink = useGetCryptoGiftTgLink();

  useEffectOnce(() => {
    googleAnalytics.firePageViewEvent('CryptoGift-Success', location.pathname);
  });

  useEffect(() => {
    if (!state.id) {
      navigate('/crypto-gifts');
    }
  }, [navigate, state.id]);
  const { isPrompt } = useCommonState();
  const [, setCopied] = useCopyToClipboard();
  const onClickShare = useCallback(() => {
    setCopied(`${cryptoGiftUrl}/cryptoGift?id=${state.id}`);
    singleMessage.success('Copy Success');
  }, [cryptoGiftUrl, setCopied, state.id]);

  const onClickTgShare = useCallback(() => {
    setCopied(getCryptoGiftTgLink(state.id));
    singleMessage.success('Copy TgLink Success');
  }, [getCryptoGiftTgLink, setCopied, state.id]);

  const mainContent = useMemo(
    () => (
      <div className={clsx('crypto-gift-success', 'flex-column-center', isPrompt && 'prompt-page')}>
        <div className="success-show-background">
          <div className="success-show-icon flex-column-center">
            <div className="header flex-center">
              <span onClick={() => navigate('/crypto-gifts')}>Done</span>
            </div>
            <CustomSvg type="BoxClose" />
            <div className="created flex-center">
              <CustomSvg type="MsgSuccess" />
              The crypto gift is packaged.
            </div>
            <div
              className="view-details"
              onClick={() =>
                navigate('/crypto-gifts/detail', { state: { id: state.id, fromPage: FromPageEnum.cryptoGiftSuccess } })
              }>
              View Details
            </div>
          </div>
        </div>
        <div className="tip-msg">Share the surprise with your friends NOW!</div>
        <div className="share-btn">
          <Button type="primary" className="flex-center" onClick={onClickShare}>
            <CustomSvg type="CopyInteractive" />
            Copy Link
          </Button>
          <Button type="primary" className="flex-center" onClick={onClickTgShare}>
            <CustomSvg type="CopyInteractive" />
            Copy Tg Link
          </Button>
        </div>
      </div>
    ),
    [isPrompt, navigate, onClickShare, onClickTgShare, state.id],
  );
  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
