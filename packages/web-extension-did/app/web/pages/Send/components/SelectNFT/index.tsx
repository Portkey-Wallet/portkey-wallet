import { useCallback } from 'react';
import { IAssetNftCollection, INftInfoType } from '@portkey-wallet/store/store-ca/assets/type';
import NFTImageDisplay from 'pages/components/NFTImageDisplay';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import CircleLoading from 'components/CircleLoading';
import './index.less';

export interface SelectNFTProps {
  nftInfos: IAssetNftCollection[];
  noDataMessage: string;
  toAddress?: string;
  loading: boolean;
}

export default function SelectNFT({ nftInfos = [], noDataMessage, toAddress, loading }: SelectNFTProps) {
  const isMainnet = useIsMainnet();
  // TODO-SA
  console.log(toAddress);
  const renderItem = useCallback(
    (nft: INftInfoType) => {
      return (
        <div className="nft-item flex-row-center gap-8">
          <NFTImageDisplay
            src={nft.imageUrl}
            width={42}
            alias={nft.alias}
            isSeed={nft.isSeed}
            seedType={nft.seedType}
          />
          <div className="nft-item-info flex-between-center flex-1">
            <div>
              <div>{`${nft.alias} #${nft.tokenId}`}</div>
              <div className="nft-item-chain">{`${nft.displayChainName || ''} ${isMainnet ? '' : 'Testnet'}`}</div>
            </div>
            <div>{formatTokenAmountShowWithDecimals(nft.balance, nft.decimals)}</div>
          </div>
        </div>
      );
    },
    [isMainnet],
  );
  const renderCollection = useCallback(
    (item: IAssetNftCollection) => {
      return (
        <>
          <div className="nft-collection flex-row-center gap-8" key={item.collectionName}>
            <NFTImageDisplay src={item.imageUrl} width={24} alias={item.collectionName} />
            <div>{item.collectionName}</div>
          </div>
          {item.items.map((nft) => renderItem(nft))}
        </>
      );
    },
    [renderItem],
  );
  return (
    <div className="send-select-nft">
      {loading ? (
        <CircleLoading />
      ) : nftInfos.length === 0 ? (
        <div className="no-data-message flex-center">{noDataMessage}</div>
      ) : (
        nftInfos.map((item) => renderCollection(item))
      )}
    </div>
  );
}
