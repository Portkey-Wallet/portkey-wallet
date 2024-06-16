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

export default function SuccessPage() {
  const navigate = useNavigateState<TCryptoGiftDetailLocationState>();
  const { state } = useLocationState<TCryptoGiftDetailLocationState>();
  const { referralUrl } = useCurrentNetworkInfo();
  const location = useLocation();

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
    setCopied(`${referralUrl}/cryptoGift?id=${state.id}`);
    singleMessage.success('Copy Success');
  }, [referralUrl, setCopied, state.id]);

  const mainContent = useMemo(
    () => (
      <div className={clsx('crypto-gift-success', 'flex-column-center', isPrompt && 'prompt-page')}>
        <div className="success-show-background">
          <div className="success-show-icon flex-column-center">
            <div className="header flex-center">
              <span onClick={() => navigate('/crypto-gifts')}>done</span>
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
        </div>
      </div>
    ),
    [isPrompt, navigate, onClickShare, state],
  );
  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
