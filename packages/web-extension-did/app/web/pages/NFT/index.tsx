import { Button } from 'antd';
import PromptFrame from 'pages/components/PromptFrame';
import SettingHeader from 'pages/components/SettingHeader';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { addressFormat } from '@portkey-wallet/utils';
import Copy from 'components/Copy';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { BalanceTab } from '@portkey-wallet/constants/constants-ca/assets';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useLocationState, useNavigateState } from 'hooks/router';
import { THomePageLocationState, TNFTLocationState, TSendLocationState } from 'types/router';
import './index.less';

export default function NFT() {
  const navigate = useNavigateState<TSendLocationState | THomePageLocationState>();
  const { state } = useLocationState<TNFTLocationState>();
  const { isPrompt } = useCommonState();
  const isMainNet = useIsMainnet();
  const currentNetwork = useCurrentNetworkInfo();

  const renderDetail = useMemo(() => {
    const { address, chainId } = state;
    const formatTokenContractAds = addressFormat(address, chainId, currentNetwork.walletType);
    return (
      <div className="info">
        <div className="title">Basic info</div>
        <div className="contract info-item flex-between">
          <div className="label">Contract address</div>
          <div className="contract-title flex">
            {formatTokenContractAds.replace(/(?<=^\w{6})\w+(?=\w{7})/, '...')}
            <Copy toCopy={formatTokenContractAds} />
          </div>
        </div>
        <div className="chain info-item flex-between">
          <div className="label">Blockchain</div>
          <div>{transNetworkText(state.chainId, !isMainNet)}</div>
        </div>
        <div className="alias info-item flex-between">
          <div className="label">Token symbol</div>
          <div className="alias-name">{state.symbol}</div>
        </div>
        <div className="total-supply info-item flex-between">
          <div className="label">Total supply</div>
          <div>{formatAmountShow(state.totalSupply, 0)}</div>
        </div>
      </div>
    );
  }, [currentNetwork.walletType, isMainNet, state]);

  const mainContent = useCallback(() => {
    const { collectionName, collectionImageUrl, tokenId, imageUrl, symbol, balance, alias } = state;
    return (
      <div className={clsx(['nft-detail', isPrompt && 'detail-page-prompt'])}>
        <div className="nft-detail-body">
          <SettingHeader leftCallBack={() => navigate('/', { state: { key: BalanceTab.NFT } })} />
          <div className="collection flex-start-center">
            <div className="img">
              {collectionImageUrl ? (
                <img src={collectionImageUrl} />
              ) : (
                <div className="img-text flex-center">{collectionName?.slice(0, 1)}</div>
              )}
            </div>
            <div className="name">{collectionName}</div>
          </div>
          <div className="token-id">{`${alias} #${tokenId}`}</div>
          <div className="picture flex-center">
            {imageUrl ? (
              <img className="picture-common" src={imageUrl} />
            ) : (
              <div className="picture-text picture-common flex-center">{symbol?.slice(0, 1)}</div>
            )}
          </div>
          {renderDetail}
        </div>
        <div>
          <div className="btn-wrap flex-column-center">
            <div className="balance">{`You have: ${formatAmountShow(balance, 0)}`}</div>
            <Button
              type="primary"
              onClick={() =>
                navigate(`/send/nft/${symbol}`, {
                  state: {
                    ...state,
                    decimals: 0,
                    name: state.symbol,
                  },
                })
              }>
              Send
            </Button>
          </div>
          {isPrompt && <PromptEmptyElement />}
        </div>
      </div>
    );
  }, [isPrompt, navigate, renderDetail, state]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} className="nft-detail-prompt" /> : mainContent()}</>;
}
