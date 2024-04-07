import { Button } from 'antd';
import PromptFrame from 'pages/components/PromptFrame';
import SettingHeader from 'pages/components/SettingHeader';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { addressFormat } from '@portkey-wallet/utils';
import Copy from 'components/Copy';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
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
import { useNFTItemDetail } from '@portkey-wallet/hooks/hooks-ca/assets';
import useInterval from '@portkey-wallet/hooks/useInterval';
import './index.less';

export default function NFT() {
  const navigate = useNavigateState<TSendLocationState | THomePageLocationState>();
  const { state } = useLocationState<TNFTLocationState>();
  const { isPrompt } = useCommonState();
  const isMainNet = useIsMainnet();
  const currentNetwork = useCurrentNetworkInfo();
  const [nftDetail, setNftDetail] = useState<TNFTLocationState>(state);
  const refreshTime = useMemo(() => {
    if (nftDetail.recommendedRefreshSeconds && nftDetail.traitsPercentages) {
      return nftDetail.recommendedRefreshSeconds * 1000;
    }
    return 0;
  }, [nftDetail.recommendedRefreshSeconds, nftDetail.traitsPercentages]);
  const fetchNFTItemDetail = useNFTItemDetail();

  const updateNFTItemDetail = useCallback(async () => {
    try {
      const data = await fetchNFTItemDetail({ symbol: nftDetail.symbol, chainId: nftDetail.chainId });
      setNftDetail((pre) => ({ ...pre, ...data }));
    } catch (error) {
      console.log('fetch nft item error', error);
    }
  }, [fetchNFTItemDetail, nftDetail.symbol, nftDetail.chainId]);

  const getNFTDetailTimer = useInterval(
    () => {
      if (refreshTime) {
        updateNFTItemDetail();
      } else {
        getNFTDetailTimer.remove();
      }
    },
    [refreshTime, updateNFTItemDetail],
    refreshTime,
  );

  useEffectOnce(() => {
    const app = document.getElementById('portkey-ui-root');
    if (!app) return;
    app.scrollTop = 0;
  });

  const renderBasicInfo = useMemo(() => {
    const { tokenContractAddress, chainId } = nftDetail;
    const formatTokenContractAds = addressFormat(tokenContractAddress, chainId, currentNetwork.walletType);
    return (
      <div className="info basic-info">
        <div className="info-title">Basic Info</div>
        <div className="contract info-item flex-between">
          <div className="label">Contract Address</div>
          <div className="contract-title flex">
            {formatTokenContractAds.replace(/(?<=^\w{8})\w+(?=\w{9})/, '...')}
            <Copy toCopy={formatTokenContractAds} />
          </div>
        </div>
        <div className="chain info-item flex-between">
          <div className="label">Blockchain</div>
          <div>{transNetworkText(nftDetail.chainId, !isMainNet)}</div>
        </div>
        <div className="info-item flex-between">
          <div className="label">Symbol</div>
          <div className="content">{nftDetail.symbol}</div>
        </div>
        <div className="total-supply info-item flex-between">
          <div className="label">Total Supply</div>
          <div>{formatTokenAmountShowWithDecimals(nftDetail.totalSupply, nftDetail.decimals || 0)}</div>
        </div>
      </div>
    );
  }, [currentNetwork.walletType, isMainNet, nftDetail]);

  const renderIsSeedInfo = useMemo(() => {
    const { seedType, expires, seedOwnedSymbol, isSeed } = nftDetail;
    return isSeed ? (
      <div className="info seed-info">
        <div className="info-title">Token Creation via This Seed</div>
        <div className="info-item flex-between">
          <div className="label">Type</div>
          <div>{SeedTypeEnum[seedType || SeedTypeEnum.None]}</div>
        </div>
        <div className="info-item flex-between">
          <div className="label">Token Symbol</div>
          <div className="content">{seedOwnedSymbol}</div>
        </div>
        <div className="info-item flex-between">
          <div className="label">Expires</div>
          <div>{formatTransferTime(expires ?? '')}</div>
        </div>
      </div>
    ) : (
      <></>
    );
  }, [nftDetail]);

  const renderInscriptionInfo = useMemo(() => {
    const { inscriptionName, limitPerMint } = nftDetail;
    return inscriptionName ? (
      <div className="info inscription-info">
        <div className="info-title">Inscription Info</div>
        <div className="info-item flex-between">
          <div className="label">Inscription Name</div>
          <div className="content">{inscriptionName}</div>
        </div>
        {limitPerMint != null && (
          <div className="info-item flex-between">
            <div className="label">Limit Per Mint</div>
            <div>{limitPerMint}</div>
          </div>
        )}
      </div>
    ) : (
      <></>
    );
  }, [nftDetail]);

  const renderTraitsInfo = useMemo(() => {
    const { traitsPercentages } = nftDetail;
    return traitsPercentages ? (
      <div className="info traits-info">
        <div className="info-title">Traits</div>
        {traitsPercentages.map((trait, i) => (
          <div key={`${trait.traitType}_${i}`} className="info-item flex-between-center">
            <div className="label">
              <div>{trait.traitType}</div>
              <div className="label-bold">{trait.value}</div>
            </div>
            <div className="content">{trait.percent}</div>
          </div>
        ))}
      </div>
    ) : (
      <></>
    );
  }, [nftDetail]);

  const renderGenerationInfo = useMemo(() => {
    const { generation } = nftDetail;
    return generation ? (
      <div className="info generation-info">
        <div className="info-title">Generation Info</div>
        <div className="info-item flex-between-center">
          <div className="label">Generation</div>
          <div>{generation}</div>
        </div>
      </div>
    ) : (
      <></>
    );
  }, [nftDetail]);

  const mainContent = useCallback(() => {
    const { collectionName, collectionImageUrl, tokenId, imageUrl, symbol, balance, alias, decimals = 0 } = nftDetail;
    const seedTypeTag = getSeedTypeTag(nftDetail, NFTSizeEnum.large);

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
          <div className="nft-info flex-column">
            {renderBasicInfo}
            {renderIsSeedInfo}
            {renderTraitsInfo}
            {renderGenerationInfo}
            {renderInscriptionInfo}
          </div>
        </div>
        <div>
          <div className="btn-wrap flex-column-center">
            <div className="balance">{`You have: ${formatTokenAmountShowWithDecimals(balance, decimals)}`}</div>
            <Button
              type="primary"
              onClick={() =>
                navigate(`/send/nft/${symbol}`, {
                  state: {
                    ...nftDetail,
                    address: nftDetail.tokenContractAddress,
                    decimals: Number(nftDetail.decimals),
                    name: nftDetail.symbol,
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
  }, [
    isPrompt,
    navigate,
    renderBasicInfo,
    renderGenerationInfo,
    renderInscriptionInfo,
    renderIsSeedInfo,
    renderTraitsInfo,
    nftDetail,
  ]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} className="nft-detail-prompt" /> : mainContent()}</>;
}
