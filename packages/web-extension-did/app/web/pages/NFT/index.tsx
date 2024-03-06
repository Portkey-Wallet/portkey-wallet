import { Button } from 'antd';
import PromptFrame from 'pages/components/PromptFrame';
import SettingHeader from 'pages/components/SettingHeader';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { addressFormat } from '@portkey-wallet/utils';
import Copy from 'components/Copy';
import { formatAmountShow, divDecimals } from '@portkey-wallet/utils/converter';
import { BalanceTab } from '@portkey-wallet/constants/constants-ca/assets';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useLocationState, useNavigateState } from 'hooks/router';
import { THomePageLocationState, TNFTLocationState, TSendLocationState } from 'types/router';
import { NFTSizeEnum, getSeedTypeTag } from 'utils/assets';
import CustomSvg from 'components/CustomSvg';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import { SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';
import './index.less';

export default function NFT() {
  const navigate = useNavigateState<TSendLocationState | THomePageLocationState>();
  const { state } = useLocationState<TNFTLocationState>();
  const { isPrompt } = useCommonState();
  const isMainNet = useIsMainnet();
  const currentNetwork = useCurrentNetworkInfo();

  useEffectOnce(() => {
    const app = document.getElementById('portkey-ui-root');
    if (!app) return;
    app.scrollTop = 0;
  });

  const renderDetail = useMemo(() => {
    const { address, chainId, inscriptionName, seedType, limitPerMint, expires, seedOwnedSymbol } = state;
    const formatTokenContractAds = addressFormat(address, chainId, currentNetwork.walletType);
    return (
      <div className="info-basic flex-column">
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
            <div className="label">Symbol</div>
            <div className="alias-name">{state.symbol}</div>
          </div>
          <div className="total-supply info-item flex-between">
            <div className="label">Total supply</div>
            <div>{formatAmountShow(divDecimals(state.totalSupply, state.decimals || 0))}</div>
          </div>
        </div>
        {seedOwnedSymbol && (
          <div className="info">
            <div className="title">Token Creation via This Seed</div>
            <div className="info-item flex-between">
              <div className="label">Type</div>
              <div>{SeedTypeEnum[seedType || SeedTypeEnum.None]}</div>
            </div>
            <div className="info-item flex-between">
              <div className="label">Token Symbol</div>
              <div>{seedOwnedSymbol}</div>
            </div>
            <div className="info-item flex-between">
              <div className="label">Expires</div>
              <div>{formatTransferTime(expires ?? '')}</div>
            </div>
          </div>
        )}
        {inscriptionName && (
          <div className="info">
            <div className="title">Inscription info</div>
            <div className="info-item flex-between">
              <div className="label">Inscription Name</div>
              <div>{inscriptionName}</div>
            </div>
            <div className="info-item flex-between">
              <div className="label">Limit Per Mint</div>
              <div>{limitPerMint}</div>
            </div>
          </div>
        )}
      </div>
    );
  }, [currentNetwork.walletType, isMainNet, state]);

  const mainContent = useCallback(() => {
    const { collectionName, collectionImageUrl, tokenId, imageUrl, symbol, balance, alias, decimals = 0 } = state;
    const seedTypeTag = getSeedTypeTag(state, NFTSizeEnum.large);

    return (
      <div id="nft-detail" className={clsx(['nft-detail', isPrompt && 'detail-page-prompt'])}>
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
            {seedTypeTag && <CustomSvg type={seedTypeTag} />}
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
            <div className="balance">{`You have: ${formatAmountShow(divDecimals(balance, decimals))}`}</div>
            <Button
              type="primary"
              onClick={() =>
                navigate(`/send/nft/${symbol}`, {
                  state: {
                    ...state,
                    decimals: Number(state.decimals),
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
