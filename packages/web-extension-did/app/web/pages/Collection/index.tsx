import clsx from 'clsx';
import CommonHeader from 'components/CommonHeader';
import { useLocationState, useNavigateState } from 'hooks/router';
import PromptFrame from 'pages/components/PromptFrame';
import { useEffect, useMemo, useCallback } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import { THomePageLocationState, TSendLocationState, TNFTLocationState } from 'types/router';
import { useAccountNFTCollectionInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';

import './index.less';

const Collection = () => {
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const navigate = useNavigateState<TSendLocationState | THomePageLocationState>();

  const { state } = useLocationState<TNFTLocationState>();

  const { accountNFTList, fetchAccountNFTItem } = useAccountNFTCollectionInfo();

  const caAddressInfos = useCaAddressInfoList();

  console.log('accountNFTList', accountNFTList);

  const currentCollection: any = useMemo(() => {
    return accountNFTList.filter(
      (list) => list.collectionName === state.collectionName && state.chainId === list.chainId,
    )[0];
  }, [accountNFTList, state]);

  const getNFTItems = useCallback(async () => {
    await fetchAccountNFTItem({
      symbol: state.symbol,
      chainId: state.chainId,
      pageNum: currentCollection.itemCount,
      caAddressInfos: caAddressInfos.filter((item) => item.chainId === state.chainId),
    });
  }, []);

  useEffect(() => {
    getNFTItems();
  }, []);

  const content = () => {
    return (
      <div className={clsx(['collection-detail', isPrompt && 'detail-page-prompt'])}>
        <CommonHeader onLeftBack={() => navigate(-1)} />
        <div className="collection-detail-box">
          <div className="collection-detail-title">
            <img src={state.collectionImageUrl} alt="" width={48} height={48} />
            <div className="collection-name">{state.collectionName}</div>
            <div className="collection-chain">
              {state.displayChainName} • {currentCollection?.itemCount} items
            </div>
          </div>
          <div className="collection-detail-lists">
            {currentCollection.children.map((list: any) => {
              return (
                <div
                  className="collection-detail-list"
                  key={list.tokenId}
                  onClick={() =>
                    navigate('/nft', {
                      state: { ...list, collectionName: state.collectionName, collectionImageUrl: state.imageUrl },
                    })
                  }>
                  <img src={list.imageUrl} alt="" width={32} height={32} />
                  <div className="token-name">{list.tokenName}</div>
                  <div className="balance-of">{formatTokenAmountShowWithDecimals(list.balance, list.decimals)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return <>{isPrompt && isNotLessThan768 ? <PromptFrame content={content()} /> : content()}</>;
};

export default Collection;
