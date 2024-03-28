import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { useCaAddressInfoList, useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import TokenImageDisplay from '../TokenImageDisplay';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { NFTSizeEnum, getSeedTypeTag } from 'utils/assets';
import { IAssetItemType } from '@portkey-wallet/store/store-ca/assets/type';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { PAGE_SIZE_IN_ACCOUNT_ASSETS } from '@portkey-wallet/constants/constants-ca/assets';
import { useDebounceCallback, useEffectOnce } from '@portkey-wallet/hooks';
import useToken from '@portkey-wallet/hooks/hooks-ca/useToken';
import { useAccountAssetsInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { fetchAssetsListByFilter, fetchTokenListByFilter } from './utils';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import './index.less';

export interface ICustomTokenListProps {
  onChange?: (v: IAssetItemType, type: 'token' | 'nft') => void;
  onClose?: () => void;
  title?: ReactNode;
  searchPlaceHolder?: string;
  drawerType: 'send' | 'receive';
}

export default function CustomTokenList({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  drawerType,
}: ICustomTokenListProps) {
  const { t } = useTranslation();
  const isMainnet = useIsMainnet();
  const { tokenDataShowInMarket, totalRecordCount: tokenTotalRecordCount, fetchTokenInfoList } = useToken();
  const {
    accountAssetsList,
    totalRecordCount: assetsTotalRecordCount,
    fetchAccountAssetsInfoList,
  } = useAccountAssetsInfo();
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const { isPrompt } = useCommonState();
  const [filterWord, setFilterWord] = useState<string>('');
  const [assetList, setAssetList] = useState<TokenItemShowType[] | IAssetItemType[]>([]);
  const chainIdArray = useChainIdList();
  const caAddressInfos = useCaAddressInfoList();
  const hasMoreData = useMemo(() => {
    if (drawerType === 'send') {
      return accountAssetsList.length < assetsTotalRecordCount;
    } else {
      return tokenDataShowInMarket.length < tokenTotalRecordCount;
    }
  }, [
    drawerType,
    accountAssetsList.length,
    assetsTotalRecordCount,
    tokenDataShowInMarket.length,
    tokenTotalRecordCount,
  ]);
  useFreshTokenPrice();

  useEffectOnce(() => {
    setFilterWord('');
    if (drawerType === 'send') {
      fetchAccountAssetsInfoList({
        keyword: '',
        caAddressInfos,
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
      });
    } else {
      fetchTokenInfoList({
        chainIdArray,
        keyword: '',
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
      });
    }
  });

  const setData = useCallback(() => {
    if (drawerType === 'send') {
      setAssetList(accountAssetsList);
    } else {
      setAssetList(tokenDataShowInMarket);
    }
  }, [accountAssetsList, drawerType, tokenDataShowInMarket]);

  useEffect(() => {
    setData();
  }, [setData]);

  const handleSearch = useDebounceCallback(
    async (keyword: string) => {
      if (!keyword) return setData();
      let res;
      if (drawerType === 'send') {
        res = await fetchAssetsListByFilter({ keyword, caAddressInfos });
      } else {
        res = await fetchTokenListByFilter({ chainIdArray, keyword });
      }
      setAssetList(res.data);
    },
    [caAddressInfos, chainIdArray, drawerType, setData],
    500,
  );

  const getMoreData = useCallback(async () => {
    if (drawerType === 'send') {
      if (accountAssetsList.length && accountAssetsList.length < assetsTotalRecordCount) {
        await fetchAccountAssetsInfoList({
          keyword: '',
          caAddressInfos,
          skipCount: accountAssetsList.length,
          maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
        });
      }
    } else {
      if (tokenDataShowInMarket.length && tokenDataShowInMarket.length < tokenTotalRecordCount) {
        await fetchTokenInfoList({
          chainIdArray,
          keyword: '',
          skipCount: tokenDataShowInMarket.length,
          maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
        });
      }
    }
  }, [
    drawerType,
    accountAssetsList.length,
    assetsTotalRecordCount,
    fetchAccountAssetsInfoList,
    caAddressInfos,
    tokenDataShowInMarket.length,
    tokenTotalRecordCount,
    fetchTokenInfoList,
    chainIdArray,
  ]);

  const renderSendToken = useCallback(
    (token: IAssetItemType) => {
      return (
        <div
          className="item"
          key={`${token.symbol}_${token.chainId}`}
          onClick={onChange?.bind(undefined, token, 'token')}>
          <div className="icon flex-center">
            <TokenImageDisplay symbol={token?.symbol} src={token.tokenInfo?.imageUrl} />
          </div>
          <div className="info">
            <p className="symbol">{`${token.symbol}`}</p>
            <p className="network">{transNetworkText(token.chainId, !isMainnet)}</p>
          </div>
          <div className="amount">
            <p className="quantity">
              {formatAmountShow(divDecimals(token.tokenInfo?.balance, token.tokenInfo?.decimals))}
            </p>
            <p className="convert">{isMainnet ? `$ ${formatAmountShow(token.tokenInfo?.balanceInUsd ?? 0, 2)}` : ''}</p>
          </div>
        </div>
      );
    },
    [isMainnet, onChange],
  );

  const renderReceiveToken = useCallback(
    (token: TokenItemShowType) => {
      const tokenTmp: IAssetItemType = {
        chainId: token.chainId,
        symbol: token.symbol,
        address: token.address,
        tokenInfo: {
          imageUrl: token.imageUrl,
          balance: token.balance || '',
          decimals: token.decimals,
          balanceInUsd: token.balanceInUsd || '',
          tokenContractAddress: token.address,
        },
      };
      return (
        <div
          className="item"
          key={`${token.symbol}_${token.chainId}`}
          onClick={onChange?.bind(undefined, tokenTmp, 'token')}>
          <div className="icon flex-center">
            <TokenImageDisplay symbol={token?.symbol} src={token?.imageUrl} />
          </div>
          <div className="info">
            <p className="symbol">{`${token.symbol}`}</p>
            <p className="network">{transNetworkText(token.chainId, !isMainnet)}</p>
          </div>
        </div>
      );
    },
    [isMainnet, onChange],
  );

  const renderNft = useCallback(
    (token: IAssetItemType) => {
      const seedTypeTag = token.nftInfo ? getSeedTypeTag(token.nftInfo, NFTSizeEnum.small) : '';
      const alias = `${token.nftInfo?.alias} #${token.nftInfo?.tokenId}`;
      const aliasClassName = !isPrompt && alias.length > 15 ? 'mul-line' : '';
      return (
        <div
          key={`${token.chainId}_${token.nftInfo?.alias}_${token.nftInfo?.tokenId}`}
          className="item protocol"
          onClick={onChange?.bind(undefined, token, 'nft')}>
          <div className="avatar flex-center">
            {seedTypeTag && <CustomSvg type={seedTypeTag} />}
            {token.nftInfo?.imageUrl ? <img src={token.nftInfo.imageUrl} /> : token.nftInfo?.alias?.slice(0, 1)}
          </div>
          <div className="info">
            <p className={clsx('alias', aliasClassName)}>{alias}</p>
            <p className="network">{transNetworkText(token.chainId, !isMainnet)}</p>
          </div>
          <div className="amount">
            <div className="balance">
              {formatAmountShow(divDecimals(token.nftInfo?.balance, token.nftInfo?.decimals || 0))}
            </div>
          </div>
        </div>
      );
    },
    [isMainnet, isPrompt, onChange],
  );

  return (
    <div className="custom-token-list">
      <div className="header">
        <p>{title || 'Select Assets'}</p>
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <DropdownSearch
        overlayClassName="empty-dropdown"
        open={openDrop}
        value={filterWord}
        overlay={<div className="empty-tip">{t('There is no search result.')}</div>}
        inputProps={{
          onBlur: () => setOpenDrop(false),
          onChange: (e) => {
            const _value = e.target.value.replaceAll(' ', '');
            if (!_value) setOpenDrop(false);

            setFilterWord(_value);
            handleSearch(_value);
          },
          placeholder: searchPlaceHolder || 'Search Assets',
        }}
      />
      <div className="list">
        {assetList.length === 0 ? (
          <div className="empty-content">
            <p className="empty-text">
              {filterWord.length === 0 ? 'There are currently no assets to send' : 'There is no search result'}
            </p>
          </div>
        ) : (
          assetList.map((token: TokenItemShowType | IAssetItemType) => {
            if (drawerType === 'send') {
              return (token as IAssetItemType).nftInfo?.tokenId ? renderNft(token) : renderSendToken(token);
            } else {
              return renderReceiveToken(token as TokenItemShowType);
            }
          })
        )}
        {!filterWord && <LoadingMore hasMore={hasMoreData} loadMore={getMoreData} className="load-more" />}
      </div>
    </div>
  );
}
