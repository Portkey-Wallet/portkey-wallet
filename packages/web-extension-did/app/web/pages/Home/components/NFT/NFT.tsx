import { useCaAddresses, useCaAddressInfoList, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchNFTAsync, fetchNFTCollectionsAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { ChainId } from '@portkey-wallet/types';
import { NFTCollectionItemShowType, NFTItemBaseType } from '@portkey-wallet/types/types-ca/assets';
import { Collapse } from 'antd';
import { List } from 'antd-mobile';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { useAppDispatch, useAssetInfo, useCommonState } from 'store/Provider/hooks';
import './index.less';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { PAGE_SIZE_IN_NFT_ITEM } from '@portkey-wallet/constants/constants-ca/assets';
import { PAGE_SIZE_IN_NFT_ITEM_PROMPT } from 'constants/index';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

export default function NFT() {
  const nav = useNavigate();
  const [openPanel, setOpenPanel] = useState<string[]>([]);
  const [nftNum, setNftNum] = useState<Record<string, number>>({});
  const isMainnet = useIsMainnet();
  const {
    accountNFT: { accountNFTList },
  } = useAssetInfo();
  const dispatch = useAppDispatch();
  const caAddresses = useCaAddresses();
  const wallet = useCurrentWalletInfo();
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
          caAddresses: [wallet?.[chainId]?.caAddress || ''],
          pageNum: curNftNum,
          caAddressInfos: caAddressInfos.filter((item) => item.chainId === chainId),
        }),
      );
      setNftNum({ ...nftNum, [nftColKey]: curNftNum + 1 });
      setGetMoreFlag(false);
    },
    [caAddressInfos, dispatch, nftNum, wallet, getMoreFlag],
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
              caAddresses: [wallet?.[curTmp[1] as ChainId]?.caAddress || ''],
              pageNum: 0,
              caAddressInfos: caAddressInfos.filter((item) => item.chainId === curTmp[1]),
            }),
          );
          setNftNum({ ...nftNum, [cur]: 1 });
        }
      });
      setOpenPanel(openArr);
    },
    [caAddressInfos, dispatch, nftNum, openPanel, wallet],
  );

  useEffect(() => {
    dispatch(fetchNFTCollectionsAsync({ caAddresses, maxNFTCount: maxNftNum, caAddressInfos }));
  }, [caAddressInfos, caAddresses, dispatch, maxNftNum]);

  const renderItem = useCallback(
    (nft: NFTCollectionItemShowType) => {
      const nftColKey = `${nft.symbol}_${nft.chainId}`;
      return (
        <Collapse.Panel
          key={nftColKey}
          header={
            <div className="protocol">
              <div className="avatar">
                {nft.imageUrl ? <img src={nft.imageUrl} /> : nft.collectionName?.slice(0, 1)}
              </div>
              <div className="info">
                <p className="alias">{nft.collectionName}</p>
                <p className="network">{transNetworkText(nft.chainId, !isMainnet)}</p>
              </div>
              <div className="amount">{nft.itemCount}</div>
            </div>
          }>
          <div className="list">
            {!!nftNum[nftColKey] &&
              nft.children.map((nftItem: NFTItemBaseType, index: number) => {
                const curNftNum = nftNum[nftColKey] ?? 0;
                return (
                  index < curNftNum * maxNftNum && (
                    <div
                      key={`${nft.symbol}-${nftItem.symbol}`}
                      style={{
                        backgroundImage: `url('${nftItem.imageUrl}')`,
                      }}
                      className={clsx(['item', nftItem.imageUrl ? 'item-img' : ''])}
                      onClick={() => {
                        nav('/nft', {
                          state: {
                            ...nftItem,
                            address: nftItem.tokenContractAddress,
                            decimals: 0,
                            collectionName: nft.collectionName,
                            collectionImageUrl: nft.imageUrl,
                          },
                        });
                      }}>
                      <div className="mask">
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
