import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Switch } from 'antd';
import CommonHeader from 'components/CommonHeader';
import CustomSvg from 'components/CustomSvg';
import { CustomSvgV3 } from 'components/CustomSvgV3';

import { IUserTokenItem, IUserTokenItemResponse } from '@portkey-wallet/types/types-eoa/token';
import DropdownSearch from 'components/DropdownSearch';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useCommonState, useLoading, useUserInfo } from 'store/Provider/hooks';
import { useChainIdList } from '@portkey-wallet/hooks/hooks-eoa/wallet';
// import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import { request } from '@portkey-wallet/api/api-eoa';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import { handleErrorMessage } from '@portkey-wallet/utils';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import singleMessage from 'utils/singleMessage';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_IN_ACCOUNT_ASSETS } from '@portkey-wallet/constants/constants-eoa/assets';
import './index.less';
import CustomChainSelectDrawer from 'pages/components/CustomChainSelectDrawer';
import CustomChainSelectModal from 'pages/components/CustomChainSelectModal';
import { useTokenLegacy } from '@portkey-wallet/hooks/hooks-eoa/useToken';
import { useManagerTokenInfo } from '@portkey-wallet/hooks/hooks-eoa/assets';
// import { transNetworkText } from '@portkey-wallet/utils/activity';
// import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';

export default function AddToken() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tokenDataShowInMarket, totalRecordCount, fetchTokenInfoList } = useTokenLegacy();
  const { switchToken } = useManagerTokenInfo();

  const [filterWord, setFilterWord] = useState<string>('');
  const { passwordSeed } = useUserInfo();
  const appDispatch = useAppDispatch();
  const chainIdArray = useChainIdList();
  // const isMainnet = useIsMainnet();
  const { setLoading } = useLoading();
  const [showList, setTokenShowList] = useState(tokenDataShowInMarket);

  const tokenShowList = useMemo(() => {
    return showList.map((i) => {
      const item = tokenDataShowInMarket.find((t) => t.id === i.id);
      if (item)
        return {
          ...item,
          isAdded: item?.isAdded,
        };
      return i;
    });
  }, [showList, tokenDataShowInMarket]);

  const hasMoreToken = useMemo(
    () => tokenDataShowInMarket.length < totalRecordCount,
    [tokenDataShowInMarket.length, totalRecordCount],
  );

  const getMoreTokenInfo = useCallback(async () => {
    if (tokenDataShowInMarket.length && tokenDataShowInMarket.length < totalRecordCount) {
      await fetchTokenInfoList({
        chainIdArray,
        keyword: '',
        skipCount: tokenDataShowInMarket.length,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
      });
    }
  }, [chainIdArray, fetchTokenInfoList, tokenDataShowInMarket.length, totalRecordCount]);

  useEffect(() => {
    if (!filterWord) {
      setTokenShowList(tokenDataShowInMarket);
    }
  }, [filterWord, tokenDataShowInMarket]);

  useEffect(() => {
    console.log('filterWord is', !filterWord);
    if (!filterWord) {
      fetchTokenInfoList({ keyword: '', chainIdArray, skipCount: 0, maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS });
    }
  }, [passwordSeed, appDispatch, chainIdArray, filterWord, fetchTokenInfoList]);

  const handleAddCustomToken = useCallback(() => {
    setFilterWord('');
    navigate('/custom-token');
  }, [navigate]);

  const handleSearch = useCallback(
    async (keyword: string) => {
      try {
        if (!keyword) return;
        const res = await request.token.fetchTokenListBySearch({
          params: {
            symbol: keyword,
            chainIds: chainIdArray,
            skipCount: 0,
            maxResultCount: PAGE_SIZE_DEFAULT,
            version: '1.11.1',
          },
        });
        console.log('search result:', res);
        const _target = (res || []).map((item: any) => ({
          ...item,
          isAdded:
            tokenDataShowInMarket?.find((it) => it.symbol === item.symbol && it.chainId === item.chainId)?.isAdded ||
            false,
          userTokenId: item.id,
        }));
        setTokenShowList(_target);
      } catch (error) {
        setTokenShowList([]);
        console.log('filter search error', error);
      }
    },
    [chainIdArray, tokenDataShowInMarket],
  );

  const searchDebounce = useDebounceCallback(
    async (params) => {
      setLoading(true);
      await handleSearch(params);
      setLoading(false);
    },
    [handleSearch, setLoading],
    500,
  );

  // const handleUserTokenDisplay = useCallback(
  //   async (item: IUserTokenItemResponse) => {
  //     try {
  //       setLoading(true);
  //       const displayParam = item.displayStatus === 'None' ? true : false;
  //       await request.token.userTokensDisplaySwitch({
  //         params: {
  //           isDisplay: displayParam,
  //           ids: [item?.tokens?.[0].id, item?.tokens?.[1].id],
  //         },
  //       });
  //       await sleep(1000);
  //       if (!filterWord) {
  //         await fetchTokenInfoList({
  //           chainIdArray,
  //           keyword: '',
  //           skipCount: 0,
  //           maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
  //         });
  //       } else {
  //         await handleSearch(filterWord);
  //       }
  //       singleMessage.success('success');
  //       // setTokenShowList((prev)=> {...prev, })
  //     } catch (error: any) {
  //       const err = handleErrorMessage(error, 'handle display error');
  //       singleMessage.error(err);
  //       console.log('=== userToken display', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [chainIdArray, fetchTokenInfoList, filterWord, handleSearch, setLoading],
  // );
  const handleUserTokenSingleDisplay = useCallback(
    async (display: boolean, id: string) => {
      if (!id) return;
      const item = tokenShowList.find((i) => i.id === id);
      if (!item) return;
      try {
        setLoading(true);
        switchToken(item as any, display);
        singleMessage.success('success');
      } catch (error: any) {
        const err = handleErrorMessage(error, 'handle display error');
        singleMessage.error(err);
        console.log('=== userToken display', error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, switchToken, tokenShowList],
  );
  const renderTokenItemBtn = useCallback(
    (item: any) => {
      const isDefault = item.isDefault;
      const isAdded = item.isAdded;
      if (isDefault) {
        return (
          <span className="add-token-btn-icon">
            <CustomSvgV3 type="GaryLock" />
          </span>
        );
      }

      return (
        <div className="flex-row-center">
          {/* <span className="edit-btn-icon">
            <CustomSvg
              type="InteractiveEdit"
              onClick={() => {
                setChainOpen(true);
                setCurrentToken(item);
              }}
            />
          </span> */}
          <Switch
            checked={isAdded}
            className={isAdded ? 'checked-true' : 'checked-false'}
            onChange={async () => {
              await handleUserTokenSingleDisplay(!isAdded, item.id);
            }}
          />
        </div>
      );
    },
    [handleUserTokenSingleDisplay],
  );
  // const calDisplayStatusText = useCallback(
  //   (item: IUserTokenItemResponse) => {
  //     let partialChainId = undefined;
  //     if (item?.tokens && item?.tokens.length > 1) {
  //       partialChainId = item?.tokens?.[0]?.isDisplay ? item?.tokens?.[0]?.chainId : item?.tokens?.[1]?.chainId;
  //     } else {
  //       partialChainId = item?.tokens?.[0]?.chainId;
  //     }
  //     return item.displayStatus === 'All'
  //       ? 'All Networks'
  //       : item.displayStatus === 'Partial'
  //       ? transNetworkText(partialChainId || 'AELF', !isMainnet)
  //       : 'Balance Hidden';
  //   },
  //   [isMainnet],
  // );
  const renderTokenItem = useCallback(
    (list: IUserTokenItem) => {
      return (
        <div className="token-item" key={list?.id}>
          <div className="token-item-content">
            <div className="token-icon-box">
              <TokenImageDisplay className="custom-logo" width={40} symbol={list.symbol} src={list.imageUrl} />
              <TokenImageDisplay className="custom-chain" width={20} symbol={list.symbol} src={list.chainImageUrl} />
            </div>
            <p className="token-info">
              <span className="token-item-symbol">{list.label || list.symbol}</span>
              <span className="token-item-net">{list.displayChainName}</span>
            </p>
          </div>
          <div className="token-item-action">{renderTokenItemBtn(list)}</div>
        </div>
      );
    },
    [renderTokenItemBtn],
  );

  const renderNoSearchResult = useMemo(
    () => (
      <div className="flex-column-center no-result">
        <p className="desc">{t('No tokens available')}</p>
        <div className="flex-center">
          <Button className="flex-row-center add-button flex-center" type="primary" onClick={handleAddCustomToken}>
            <CustomSvg type="Plus" className="plug-svg" />
            {t('Import token')}
          </Button>
        </div>
      </div>
    ),
    [handleAddCustomToken, t],
  );

  const renderSearchResultTip = useMemo(
    () => (
      <div className="flex-column-center search-result-tip">
        <p className="desc">{t('Don’t see your token?')}</p>
        <div className="flex-center">
          <Button className="flex-row-center add-button flex-center" type="primary" onClick={handleAddCustomToken}>
            <CustomSvg type="Plus" className="plug-svg" />
            {t('Import token')}
          </Button>
        </div>
      </div>
    ),
    [handleAddCustomToken, t],
  );

  const renderTokenList = useMemo(
    () =>
      tokenShowList.length ? (
        <div className="add-token-content flex-column-between">
          <div>
            {tokenShowList.map((item) => renderTokenItem(item))}
            {!filterWord && <LoadingMore hasMore={hasMoreToken} loadMore={getMoreTokenInfo} className="load-more" />}
          </div>
          {filterWord && renderSearchResultTip}
        </div>
      ) : (
        <>{filterWord ? renderNoSearchResult : ''}</>
      ),
    [
      filterWord,
      getMoreTokenInfo,
      hasMoreToken,
      renderNoSearchResult,
      renderSearchResultTip,
      renderTokenItem,
      tokenShowList,
    ],
  );

  const { isNotLessThan768 } = useCommonState();
  const [chainOpen, setChainOpen] = useState(false);
  const [currentToken, setCurrentToken] = useState<IUserTokenItemResponse | undefined>(undefined);
  const SelectChainELe = useMemo(() => {
    return isNotLessThan768 ? (
      <CustomChainSelectModal
        open={chainOpen}
        item={currentToken}
        onClose={() => {
          setChainOpen(false);
          setCurrentToken(undefined);
        }}
        onChange={async (display, id) => {
          await handleUserTokenSingleDisplay(display, id || '');
        }}
      />
    ) : (
      <CustomChainSelectDrawer
        open={chainOpen}
        height="208"
        maskClosable={true}
        item={currentToken}
        placement="bottom"
        onClose={() => {
          setChainOpen(false);
          setCurrentToken(undefined);
        }}
        onChange={async (display, id) => {
          await handleUserTokenSingleDisplay(display, id || '');
        }}
      />
    );
  }, [chainOpen, currentToken, handleUserTokenSingleDisplay, isNotLessThan768]);

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['add-token'])}>
        <div className="add-token-top">
          <CommonHeader
            title={t('Manage Token List')}
            onLeftBack={() => navigate('/')}
            rightElementList={[{ customSvgType: 'add-token', onClick: handleAddCustomToken }]}
          />
          <DropdownSearch
            overlay={<></>}
            value={filterWord}
            className="search-box"
            inputProps={{
              onChange: (e) => {
                const _value = e.target.value.replaceAll(' ', '');
                setFilterWord(_value);
                searchDebounce(_value);
              },
              placeholder: 'Search token',
            }}
          />
        </div>
        {renderTokenList}
        {SelectChainELe}
      </div>
    );
  }, [SelectChainELe, filterWord, handleAddCustomToken, navigate, renderTokenList, searchDebounce, t]);

  return <>{mainContent()}</>;
}
