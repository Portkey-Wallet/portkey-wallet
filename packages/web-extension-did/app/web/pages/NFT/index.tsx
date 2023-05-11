import { Button } from 'antd';
import PromptFrame from 'pages/components/PromptFrame';
import SettingHeader from 'pages/components/SettingHeader';
import { useLocation, useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import './index.less';
import { useCallback } from 'react';

export default function NFT() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isPrompt } = useCommonState();

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['nft-detail', isPrompt ? 'detail-page-prompt' : null])}>
        <div className="nft-detail-body">
          <SettingHeader leftCallBack={() => navigate(-1)} />
          <div className="picture picture-common flex-center">
            {state.imageUrl ? (
              <img className="picture-common" src={state.imageUrl} />
            ) : (
              <div className="picture-text picture-common flex-center">{state.symbol?.slice(0, 1)}</div>
            )}
          </div>

          <div className="info">
            <div className="title flex">
              <p className="title-alias">{state.alias}&nbsp;</p>
              <p>#{state.tokenId}</p>
            </div>
            <p className="amount">Balance: {state.balance}</p>
            <p className="label">{state.symbol}</p>
            {/* <p className="information">Symbol information Symbol information Symbol information</p> */}
          </div>
        </div>
        <div className="btn-wrap">
          <Button type="primary" onClick={() => navigate(`/send/nft/${state.symbol}`, { state })}>
            Send
          </Button>
        </div>
      </div>
    );
  }, [isPrompt, navigate, state]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} className="nft-detail-prompt" /> : mainContent()}</>;
}
