import { Button, Skeleton } from 'antd';
import PromptFrame from 'pages/components/PromptFrame';
import CommonHeader from 'components/CommonHeader';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { PopoverMenuList } from '@portkey-wallet/im-ui-web';
import { useSetUserAvatar } from '@portkey-wallet/hooks/hooks-ca/wallet';
import singleMessage from 'utils/singleMessage';
import './index.less';

export default function NFT() {
  const navigate = useNavigateState<TSendLocationState | THomePageLocationState>();
  const { state } = useLocationState<TNFTLocationState>();
  const { isPrompt } = useCommonState();
  const isMainNet = useIsMainnet();
  const currentNetwork = useCurrentNetworkInfo();
  const [nftDetail, setNftDetail] = useState<TNFTLocationState>(state);
  const setUserAvatar = useSetUserAvatar();
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
    ) : null;
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
    ) : null;
  }, [nftDetail]);

  const renderTraitsInfo = useMemo(() => {
    const { traitsPercentages } = nftDetail;
    return traitsPercentages ? (
      <div className="info traits-info">
        <div className="info-title">Traits</div>
        {traitsPercentages.length === 0
          ? new Array(3).fill('').map((_item, index) => (
              <div key={`skeleton_${index}`} className="flex-column traits-info-skeleton">
                <Skeleton.Avatar className="skeleton-title" shape="square" active />
                <Skeleton.Avatar className="skeleton-desc" shape="square" active />
              </div>
            ))
          : traitsPercentages.map((trait, i) => (
              <div key={`${trait.traitType}_${i}`} className="info-item flex-between-center">
                <div className="label">
                  <div>{trait.traitType}</div>
                  <div className="label-bold">{trait.value}</div>
                </div>
                <div className="content">{trait.percent}</div>
              </div>
            ))}
      </div>
    ) : null;
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
    ) : null;
  }, [nftDetail]);
  const [popVisible, setPopVisible] = useState(false);

  const moreData = useMemo(() => {
    return [
      {
        key: 'profile',
        leftIcon: <CustomSvg type="Profile" />,
        children: 'Set as Profile Photo',
        onClick: async () => {
          try {
            await setUserAvatar(nftDetail.imageUrl);
            singleMessage.success('Set Avatar Success');
          } catch (error) {
            singleMessage.error('Set Avatar Failed');
          }
        },
      },
    ];
  }, [nftDetail.imageUrl, setUserAvatar]);

  const hidePop = useCallback((e: Event) => {
    try {
      const _target = e?.target as Element;
      const _className = _target?.className;
      const isFunc = _className.includes instanceof Function;
      if (isFunc && !_className.includes('nft-detail-more')) {
        setPopVisible(false);
      }
    } catch (e) {
      console.log('===chat box hidePop error', e);
    }
  }, []);
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);
  const mainContent = useCallback(() => {
    const { collectionName, collectionImageUrl, tokenId, imageUrl, symbol, balance, alias, decimals = 0 } = nftDetail;
    const seedTypeTag = getSeedTypeTag(nftDetail, NFTSizeEnum.large);

    return (
      <div id="nft-detail" className={clsx(['nft-detail', isPrompt && 'detail-page-prompt'])}>
        <div className="nft-detail-body">
          <CommonHeader
            onLeftBack={() => navigate('/', { state: { key: BalanceTab.NFT } })}
            rightElementList={[
              {
                customSvgWrapClassName: 'nft-detail-more',
                customSvgType: 'More',
                popoverProps: {
                  overlayClassName: `nft-detail-popover ${isPrompt ? '' : 'nft-detail-popover-popup'}`,
                  open: popVisible,
                  trigger: 'click',
                  showArrow: false,
                  placement: 'bottomLeft',
                  getPopupContainer: (triggerNode: any) => triggerNode.parentNode,
                  content: <PopoverMenuList data={moreData} />,
                },
                onClick: () => setPopVisible(!popVisible),
              },
            ]}
          />
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
    nftDetail,
    isPrompt,
    popVisible,
    moreData,
    renderBasicInfo,
    renderIsSeedInfo,
    renderTraitsInfo,
    renderGenerationInfo,
    renderInscriptionInfo,
    navigate,
  ]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} className="nft-detail-prompt" /> : mainContent()}</>;
}
