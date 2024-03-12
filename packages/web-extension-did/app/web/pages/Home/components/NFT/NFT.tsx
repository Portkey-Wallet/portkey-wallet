import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchNFTAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { ChainId } from '@portkey-wallet/types';
import { NFTCollectionItemShowType, NFTItemBaseType } from '@portkey-wallet/types/types-ca/assets';
import { Collapse } from 'antd';
import { List } from 'antd-mobile';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { useAppDispatch, useAssetInfo, useCommonState } from 'store/Provider/hooks';
import './index.less';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { PAGE_SIZE_IN_NFT_ITEM } from '@portkey-wallet/constants/constants-ca/assets';
import { PAGE_SIZE_IN_NFT_ITEM_PROMPT } from 'constants/index';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { getSeedTypeTag } from 'utils/assets';

export default function NFT() {
  const nav = useNavigate();
  const [openPanel, setOpenPanel] = useState<string[]>([]);
  const [nftNum, setNftNum] = useState<Record<string, number>>({});
  const isMainnet = useIsMainnet();
  const {
    accountNFT: { accountNFTList },
  } = useAssetInfo();
  const dispatch = useAppDispatch();
  const { isPrompt } = useCommonState();
  const caAddressInfos = useCaAddressInfoList();
  const [getMoreFlag, setGetMoreFlag] = useState(false);
  const maxNftNum = useMemo(() => (isPrompt ? PAGE_SIZE_IN_NFT_ITEM_PROMPT : PAGE_SIZE_IN_NFT_ITEM), [isPrompt]);

  const getMore = useCallback(
    async (symbol: string, chainId: ChainId) => {
      if (getMoreFlag) return;
      const nftColKey = `${symbol}_${chainId}`;
      const curNftNum = nftNum[nftColKey];
      setGetMoreFlag(true);
      await dispatch(
        fetchNFTAsync({
          symbol,
          chainId: chainId as ChainId,
          pageNum: curNftNum,
          caAddressInfos: caAddressInfos.filter((item) => item.chainId === chainId),
        }),
      );
      setNftNum({ ...nftNum, [nftColKey]: curNftNum + 1 });
      setGetMoreFlag(false);
    },
    [caAddressInfos, dispatch, nftNum, getMoreFlag],
  );

  const handleChange = useCallback(
    (arr: string[] | string) => {
      const openArr = typeof arr === 'string' ? [arr] : arr;
      openPanel.forEach((prev: string) => {
        if (!openArr.some((cur: string) => cur === prev)) {
          setNftNum({ ...nftNum, [prev]: 0 });
        }
      });
      openArr.forEach((cur: string) => {
        if (!openPanel.some((prev: string) => cur === prev)) {
          const curTmp = cur.split('_');
          dispatch(
            fetchNFTAsync({
              symbol: curTmp[0],
              chainId: curTmp[1] as ChainId,
              pageNum: 0,
              caAddressInfos: caAddressInfos.filter((item) => item.chainId === curTmp[1]),
            }),
          );
          setNftNum({ ...nftNum, [cur]: 1 });
        }
      });
      setOpenPanel(openArr);
    },
    [caAddressInfos, dispatch, nftNum, openPanel],
  );

  const renderItem = useCallback(
    (nft: NFTCollectionItemShowType) => {
      const nftColKey = `${nft.symbol}_${nft.chainId}`;
      return (
        <Collapse.Panel
          key={nftColKey}
          header={
            <div className="nft-collection flex-row-center">
              <div className="avatar flex-center">
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
                const curNftNum = nftNum[nftColKey] ?? 0;
                const seedTypeTag = getSeedTypeTag(nftItem);
                return (
                  index < curNftNum * maxNftNum && (
                    <div
                      key={`${nft.symbol}-${nftItem.symbol}`}
                      style={{
                        backgroundImage: `url('${nftItem.imageUrl}')`,
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
                        <p className="token-id">#{nftItem.tokenId}</p>
                      </div>
                    </div>
                  )
                );
              })}
            {!!nftNum[nftColKey] && Number(nft.totalRecordCount) > nftNum[nftColKey] * maxNftNum && (
              <div
                className="load-more"
                onClick={() => {
                  getMore(nft.symbol, nft.chainId);
                }}>
                <CustomSvg type="Down" /> More
              </div>
            )}
          </div>
        </Collapse.Panel>
      );
    },
    [getMore, isMainnet, maxNftNum, nav, nftNum],
  );

  return (
    <div className="tab-nft">
      {accountNFTList.length === 0 ? (
        <p className="empty-text">No NFTs yet</p>
      ) : (
        <List className="nft-list">
          <List.Item>
            <Collapse onChange={handleChange}>{accountNFTList.map((item) => renderItem(item))}</Collapse>
          </List.Item>
        </List>
      )}
    </div>
  );
}
