import { AccountAssetItem, AccountAssets, TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAssetInfo, useTokenInfo, useUserInfo } from 'store/Provider/hooks';
import { fetchAssetAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { useCaAddresses, useCaAddressInfoList, useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchAllTokenListAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useAmountInUsdShow, useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import TokenImageDisplay from '../TokenImageDisplay';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import './index.less';

export interface ICustomTokenListProps {
  onChange?: (v: AccountAssetItem, type: 'token' | 'nft') => void;
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
  const { accountAssets } = useAssetInfo();
  const { tokenDataShowInMarket } = useTokenInfo();
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [filterWord, setFilterWord] = useState<string>('');
  const [assetList, setAssetList] = useState<TokenItemShowType[] | AccountAssets>([]);
  const appDispatch = useAppDispatch();
  const { passwordSeed } = useUserInfo();
  const caAddresses = useCaAddresses();
  const chainIdArray = useChainIdList();
  const amountInUsdShow = useAmountInUsdShow();
  const caAddressInfos = useCaAddressInfoList();
  useFreshTokenPrice();
  useEffect(() => {
    if (drawerType === 'send') {
      setAssetList(accountAssets.accountAssetsList);
    } else {
      setAssetList(tokenDataShowInMarket);
    }
  }, [accountAssets.accountAssetsList, drawerType, tokenDataShowInMarket]);

  useEffect(() => {
    if (!passwordSeed) return;
    if (drawerType === 'send') {
      appDispatch(fetchAssetAsync({ caAddresses, keyword: filterWord, caAddressInfos }));
    } else {
      appDispatch(fetchAllTokenListAsync({ chainIdArray, keyword: filterWord }));
    }
  }, [passwordSeed, filterWord, drawerType, caAddresses, appDispatch, chainIdArray, caAddressInfos]);

  useEffect(() => {
    setFilterWord('');
  }, []);

  const renderSendToken = useCallback(
    (token: AccountAssetItem) => {
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
            <p className="convert">
              {isMainnet
                ? amountInUsdShow(token.tokenInfo?.balance || '', token.tokenInfo?.decimals || 0, token.symbol)
                : ''}
            </p>
          </div>
        </div>
      );
    },
    [amountInUsdShow, isMainnet, onChange],
  );

  const renderReceiveToken = useCallback(
    (token: TokenItemShowType) => {
      const tokenTmp: AccountAssetItem = {
        chainId: token.chainId,
        symbol: token.symbol,
        address: token.address,
        tokenInfo: {
          imageUrl: token.imageUrl,
          id: token.id || '',
          balance: token.balance,
          decimals: `${token.decimals}`,
          balanceInUsd: token.balanceInUsd,
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
    (token: AccountAssetItem) => {
      return (
        <div
          key={`${token.chainId}_${token.nftInfo?.alias}_${token.nftInfo?.tokenId}`}
          className="item protocol"
          onClick={onChange?.bind(undefined, token, 'nft')}>
          <div className="avatar">
            {token.nftInfo?.imageUrl ? <img src={token.nftInfo.imageUrl} /> : token.nftInfo?.alias?.slice(0, 1)}
          </div>
          <div className="info">
            <p className="alias">{`${token.nftInfo?.alias} #${token.nftInfo?.tokenId}`}</p>
            <p className="network">{transNetworkText(token.chainId, !isMainnet)}</p>
          </div>
          <div className="amount">
            <div className="balance">{token.nftInfo?.balance}</div>
          </div>
        </div>
      );
    },
    [isMainnet, onChange],
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
        // onPressEnter={handleSearch}
        inputProps={{
          onBlur: () => setOpenDrop(false),
          // onFocus: () => {
          // if (filterWord && !tokenDataShowInMarket.length) setOpenDrop(true);
          // },
          onChange: (e) => {
            const _value = e.target.value.replaceAll(' ', '');
            if (!_value) setOpenDrop(false);

            setFilterWord(_value);
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
          assetList.map((token: TokenItemShowType | AccountAssetItem) => {
            if (drawerType === 'send') {
              return (token as AccountAssetItem).nftInfo?.tokenId ? renderNft(token) : renderSendToken(token);
            } else {
              return renderReceiveToken(token as TokenItemShowType);
            }
          })
        )}
      </div>
    </div>
  );
}
