import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { NFTCollectionItemShowType, NFTItemBaseType } from '@portkey-wallet/types/types-ca/assets';
import { Collapse, Skeleton } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useState, useMemo, useEffect } from 'react';
import clsx from 'clsx';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import {
  PAGE_SIZE_IN_NFT_ITEM,
  PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
} from '@portkey-wallet/constants/constants-ca/assets';
import { PAGE_SIZE_IN_NFT_ITEM_PROMPT } from 'constants/index';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { getSeedTypeTag } from 'utils/assets';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { useAccountNFTCollectionInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { ZERO } from '@portkey-wallet/constants/misc';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import useGAReport from 'hooks/useGAReport';
import { useEffectOnce } from 'react-use';
import { useRecentStatus } from '@portkey-wallet/hooks/hooks-ca/freeMint';
import { FreeMintStatus } from '@portkey-wallet/types/types-ca/freeMint';
import { useNavigate } from 'react-router';

export default function NFT() {
  const nav = useNavigate();
  const { recentStatus, itemId } = useRecentStatus();
  const [openPanel, setOpenPanel] = useState<string[]>([]);
  const [nftNum, setNftNum] = useState<Record<string, number>>({});
  const [openOp, setOpenOp] = useState<boolean>(true);
  const { eForestUrl = '' } = useCurrentNetworkInfo();
  const isMainnet = useIsMainnet();
  const { accountNFTList, totalRecordCount, fetchAccountNFTCollectionInfoList, fetchAccountNFTItem, isFetching } =
    useAccountNFTCollectionInfo();
  const { isPrompt } = useCommonState();
  const caAddressInfos = useCaAddressInfoList();
  const [getMoreFlag, setGetMoreFlag] = useState(false);
  const maxNftNum = useMemo(() => (isPrompt ? PAGE_SIZE_IN_NFT_ITEM_PROMPT : PAGE_SIZE_IN_NFT_ITEM), [isPrompt]);
  const hasMoreNFTCollection = useMemo(
    () => accountNFTList.length < totalRecordCount,
    [accountNFTList.length, totalRecordCount],
  );
  const calSkeletonLength = useCallback(
    (needToShowNum: number) => (needToShowNum >= 0 ? (needToShowNum < maxNftNum ? needToShowNum : maxNftNum) : 0),
    [maxNftNum],
  );

  const { startReport, endReport } = useGAReport();

  useEffectOnce(() => {
    startReport('Home-NFTsList');
  });

  useEffect(() => {
    fetchAccountNFTCollectionInfoList({
      maxNFTCount: maxNftNum,
      caAddressInfos,
      skipCount: 0,
      maxResultCount: PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
    }).then(() => endReport('Home-NFTsList'));
  }, [caAddressInfos, endReport, fetchAccountNFTCollectionInfoList, maxNftNum]);

  const getMoreNFTCollection = useCallback(async () => {
    if (accountNFTList.length < totalRecordCount) {
      await fetchAccountNFTCollectionInfoList({
        maxNFTCount: maxNftNum,
        caAddressInfos,
        skipCount: accountNFTList.length,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
      });
    }
  }, [accountNFTList.length, caAddressInfos, fetchAccountNFTCollectionInfoList, maxNftNum, totalRecordCount]);

  const getMoreNFTItem = useCallback(
    async (symbol: string, chainId: ChainId) => {
      if (getMoreFlag) return;
      const nftColKey = `${symbol}_${chainId}`;
      const curNftNum = nftNum[nftColKey];
      setGetMoreFlag(true);
      try {
        setNftNum((pre) => ({ ...pre, [nftColKey]: curNftNum + 1 }));
        await fetchAccountNFTItem({
          symbol,
          chainId: chainId as ChainId,
          pageNum: curNftNum,
          caAddressInfos: caAddressInfos.filter((item) => item.chainId === chainId),
        });
      } catch (error) {
        console.log('===getMoreNFTItem error', error);
      } finally {
        setGetMoreFlag(false);
      }
    },
    [getMoreFlag, nftNum, fetchAccountNFTItem, caAddressInfos],
  );

  const handleChange = useCallback(
    (arr: string[] | string) => {
      const openArr = typeof arr === 'string' ? [arr] : arr;
      openPanel.forEach((prev: string) => {
        if (!openArr.some((cur: string) => cur === prev)) {
          setNftNum((pre) => ({ ...pre, [prev]: 0 }));
          setOpenOp(false);
        }
      });
      openArr.forEach((cur: string) => {
        if (!openPanel.some((prev: string) => cur === prev)) {
          const curTmp = cur.split('_');
          setOpenOp(true);
          fetchAccountNFTItem({
            symbol: curTmp[0],
            chainId: curTmp[1] as ChainId,
            pageNum: 0,
            caAddressInfos: caAddressInfos.filter((item) => item.chainId === curTmp[1]),
          });
          setNftNum((pre) => ({ ...pre, [cur]: 1 }));
        }
      });
      setOpenPanel(openArr);
    },
    [caAddressInfos, fetchAccountNFTItem, openPanel],
  );

  const handleClickForest = useCallback(() => {
    const openWinder = window.open(`${eForestUrl}/collections`, '_blank');
    if (openWinder) {
      openWinder.opener = null;
    }
  }, [eForestUrl]);

  const renderItem = useCallback(
    (nft: NFTCollectionItemShowType) => {
      const nftColKey = `${nft.symbol}_${nft.chainId}`;
      const curNftNum = nftNum?.[nftColKey] ?? 0;
      const curNFTSkeletonLength = calSkeletonLength(
        ZERO.plus(nft.itemCount)
          .minus(ZERO.plus(curNftNum - 1).times(maxNftNum))
          .toNumber(),
      );
      return (
        <Collapse.Panel
          key={nftColKey}
          header={
            <div className="nft-collection flex-row-center">
              <div className={clsx('nft-collection-avatar', 'flex-center', !nft.imageUrl && 'show-nft-default')}>
                {nft.imageUrl ? <img src={nft.imageUrl} /> : nft.collectionName?.slice(0, 1)}
              </div>
              <div className="info flex-column">
                <div className="flex-between info-top">
                  <div className="alias">{nft.collectionName}</div>
                  <div className="amount">{nft.itemCount}</div>
                </div>
                <p className="network">{transNetworkText(nft.chainId, !isMainnet)}</p>
              </div>
            </div>
          }>
          <div className="nft-item-list">
            {!!nftNum[nftColKey] &&
              nft.children.map((nftItem: NFTItemBaseType, index: number) => {
                const seedTypeTag = getSeedTypeTag(nftItem);
                return (
                  index < curNftNum * maxNftNum && (
                    <div
                      key={`${nft.symbol}-${nftItem.symbol}`}
                      style={{
                        backgroundImage: `url('${nftItem.imageUrl || ''}')`,
                      }}
                      className={clsx(['nft-item', nftItem.imageUrl ? '' : 'nft-item-no-img'])}
                      onClick={() => {
                        nav('/nft', {
                          state: {
                            ...nftItem,
                            collectionName: nft.collectionName,
                            collectionImageUrl: nft.imageUrl,
                          },
                        });
                      }}>
                      {seedTypeTag && <CustomSvg type={seedTypeTag} />}
                      <div className="mask flex-column">
                        <p className="alias">{nftItem.alias}</p>
                        <p className="token-balance">
                          {formatTokenAmountShowWithDecimals(nftItem.balance, nftItem.decimals)}
                        </p>
                      </div>
                    </div>
                  )
                );
              })}
            {nft.isFetching &&
              openOp &&
              new Array(curNFTSkeletonLength)
                .fill('')
                .map((_item, index) => (
                  <Skeleton.Avatar className="nft-item-skeleton" key={`skeleton_${index}`} shape="square" active />
                ))}
            {!!nftNum[nftColKey] && Number(nft.totalRecordCount) > nftNum[nftColKey] * maxNftNum && (
              <div
                className="load-more"
                onClick={() => {
                  getMoreNFTItem(nft.symbol, nft.chainId);
                }}>
                <CustomSvg type="Down" /> More
              </div>
            )}
          </div>
        </Collapse.Panel>
      );
    },
    [nftNum, calSkeletonLength, maxNftNum, isMainnet, openOp, nav, getMoreNFTItem],
  );

  const handleClickMint = useCallback(() => {
    if (itemId && (recentStatus === FreeMintStatus.PENDING || recentStatus === FreeMintStatus.FAIL)) {
      nav('/free-mint', { state: { itemId, status: recentStatus } });
      return;
    }
    nav('/free-mint');
  }, [itemId, nav, recentStatus]);

  const renderFreeMintTip = useMemo(() => {
    let leftText = '';
    let rightText = '';
    if (recentStatus === FreeMintStatus.PENDING) {
      leftText = 'Your NFT is being minted.';
      rightText = 'View';
    } else if (recentStatus === FreeMintStatus.FAIL) {
      leftText = 'Mint failed.';
      rightText = 'Try Again';
    } else {
      leftText = 'Mint NFTs for free!';
      rightText = 'Mint Now';
    }
    return (
      <div className="flex-between-center free-mint-tip-container">
        <div className="left-text">{leftText}</div>
        <div className="flex-row-center right-container" onClick={handleClickMint}>
          <span className="right-text">{rightText}</span>
          <CustomSvg className="flex-center" type="NewRightArrow" />
        </div>
      </div>
    );
  }, [handleClickMint, recentStatus]);

  const renderNoNFT = useCallback(() => {
    return (
      <div className={clsx('empty-nft-container', 'flex-column-between', isPrompt ? 'prompt-page' : 'ss')}>
        <div className="flex-column-center empty-nft-list">
          <CustomSvg type="NoNFTs" />
          <div>No NFTs yet</div>
        </div>
        {recentStatus === FreeMintStatus.PENDING || recentStatus === FreeMintStatus.FAIL ? (
          renderFreeMintTip
        ) : (
          <div className="free-mint-container flex-column">
            <div>Get your own NFTs to start</div>
            <div className="flex-row-center free-mint-list">
              <div className="list-item-number flex-center">1</div>
              <div className="flex-row-center list-item-text list-item-text-primary" onClick={() => nav('/free-mint')}>
                <span>Free Mint</span>
                <CustomSvg className="flex-center" type="NewRightArrow" />
              </div>
            </div>
            <div className="flex-row-center free-mint-list">
              <div className="list-item-number flex-center">2</div>
              <div className="flex list-item-text">
                <span>Buy on NFT Marketplace -</span>
                <div className="flex-row-center list-item-text-primary" onClick={handleClickForest}>
                  <span>&nbsp;Forest</span>
                  <CustomSvg className="flex-center" type="NewRightArrow" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [handleClickForest, isPrompt, nav, recentStatus, renderFreeMintTip]);

  return (
    <div className="tab-nft">
      {accountNFTList.length === 0 ? (
        renderNoNFT()
      ) : (
        <div className={clsx('nft-list', !hasMoreNFTCollection && 'hidden-loading-more')}>
          <Collapse
            collapsible={isFetching ? 'disabled' : undefined}
            onChange={handleChange}
            expandIcon={(panelProps) => (
              <CustomSvg className={panelProps.isActive ? 'is-active' : ''} type="NewRightArrow" />
            )}>
            {accountNFTList.map((item) => renderItem(item))}
          </Collapse>
          <LoadingMore hasMore={hasMoreNFTCollection} loadMore={getMoreNFTCollection} className="load-more" />
          {renderFreeMintTip}
        </div>
      )}
    </div>
  );
}
